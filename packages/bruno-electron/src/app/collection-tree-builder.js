const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const {
  hasRequestExtension,
  getCollectionFormat,
  sizeInMB
} = require('../utils/filesystem');
const {
  parseEnvironment,
  parseRequest,
  parseCollection,
  parseFolder
} = require('@usebruno/filestore');
const { uuid } = require('../utils/common');
const { getRequestUid } = require('../cache/requestUids');
const { decryptStringSafe } = require('../utils/encryption');
const { hydrateRequestWithUuid } = require('../utils/collection');
const EnvironmentSecretsStore = require('../store/env-secrets');
const { transformBrunoConfigAfterRead } = require('../utils/transformBrunoConfig');
const { setBrunoConfig } = require('../store/bruno-config');

const environmentSecretsStore = new EnvironmentSecretsStore();

const DEFAULT_IGNORES = ['node_modules', '.git'];
const MAX_DEPTH = 20;

const hydrateCollectionRootWithUuid = (collectionRoot) => {
  const params = _.get(collectionRoot, 'request.params', []);
  const headers = _.get(collectionRoot, 'request.headers', []);
  const requestVars = _.get(collectionRoot, 'request.vars.req', []);
  const responseVars = _.get(collectionRoot, 'request.vars.res', []);

  params.forEach((param) => (param.uid = uuid()));
  headers.forEach((header) => (header.uid = uuid()));
  requestVars.forEach((variable) => (variable.uid = uuid()));
  responseVars.forEach((variable) => (variable.uid = uuid()));

  return collectionRoot;
};

const envHasSecrets = (environment = {}) => {
  const secrets = _.filter(environment.variables, (v) => v.secret);
  return secrets && secrets.length > 0;
};

/**
 * Parse a single environment file and return the hydrated environment object.
 */
const parseEnvironmentFile = async (pathname, collectionPath) => {
  const basename = path.basename(pathname);
  const format = getCollectionFormat(collectionPath);
  const content = fs.readFileSync(pathname, 'utf8');

  const data = await parseEnvironment(content, { format });

  const ext = path.extname(basename);
  data.name = basename.substring(0, basename.length - ext.length);
  data.uid = getRequestUid(pathname);

  _.each(_.get(data, 'variables', []), (variable) => (variable.uid = uuid()));

  if (envHasSecrets(data)) {
    const envSecrets = environmentSecretsStore.getEnvSecrets(collectionPath, data);
    _.each(envSecrets, (secret) => {
      const variable = _.find(data.variables, (v) => v.name === secret.name);
      if (variable && secret.value) {
        const decryptionResult = decryptStringSafe(secret.value);
        variable.value = decryptionResult.value;
      }
    });
  }

  return data;
};

/**
 * Parse a request file and return the hydrated item object ready for the tree.
 */
const parseRequestFile = async (pathname, format) => {
  const content = fs.readFileSync(pathname, 'utf8');
  const fileStats = fs.statSync(pathname);

  const data = await parseRequest(content, { format });
  hydrateRequestWithUuid(data, pathname);

  return {
    uid: data.uid,
    name: data.name,
    type: data.type,
    seq: data.seq,
    tags: data.tags,
    request: data.request,
    settings: data.settings,
    examples: data.examples,
    filename: path.basename(pathname),
    pathname: pathname,
    draft: null,
    partial: false,
    loading: false,
    size: sizeInMB(fileStats?.size),
    error: null,
    isTransient: false
  };
};

/**
 * Build the nested collection tree by walking the filesystem.
 * Returns { items, environments, root, brunoConfig }
 */
const buildCollectionTree = async (collectionPath, collectionUid, brunoConfig) => {
  const format = getCollectionFormat(collectionPath);
  const ignores = [...DEFAULT_IGNORES, ...(brunoConfig?.ignore || [])];

  let root = null;
  const environments = [];

  /**
   * Recursively build the items tree for a directory.
   */
  const buildItemsForDirectory = async (dirPath, depth = 0) => {
    if (depth > MAX_DEPTH) {
      return [];
    }

    let entries;
    try {
      entries = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch {
      return [];
    }

    const items = [];

    for (const entry of entries) {
      if (ignores.includes(entry.name)) {
        continue;
      }

      // Skip .env files
      if (entry.name === '.env' || entry.name.startsWith('.env.')) {
        continue;
      }

      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Skip the environments directory at collection root
        const envDirectory = path.join(collectionPath, 'environments');
        if (path.normalize(fullPath) === path.normalize(envDirectory)) {
          // Parse environment files instead
          await parseEnvironmentsDirectory(fullPath, collectionPath);
          continue;
        }

        // Build folder item
        let folderName = entry.name;
        let folderSeq;

        const folderFilePath = path.join(fullPath, `folder.${format}`);
        let folderRoot = null;

        try {
          if (fs.existsSync(folderFilePath)) {
            const folderContent = fs.readFileSync(folderFilePath, 'utf8');
            const folderData = await parseFolder(folderContent, { format });
            folderName = folderData?.meta?.name || folderName;
            folderSeq = folderData?.meta?.seq;

            folderRoot = folderData;
            hydrateCollectionRootWithUuid(folderRoot);
          }
        } catch (error) {
          console.error(`Error parsing folder.${format} in ${fullPath}:`, error);
        }

        const childItems = await buildItemsForDirectory(fullPath, depth + 1);

        const folderItem = {
          uid: getRequestUid(fullPath),
          pathname: fullPath,
          name: folderName,
          filename: entry.name,
          collapsed: true,
          type: 'folder',
          isTransient: false,
          items: childItems
        };

        if (folderSeq !== undefined) {
          folderItem.seq = folderSeq;
        }

        if (folderRoot) {
          folderItem.root = folderRoot;
        }

        items.push(folderItem);
        continue;
      }

      if (entry.isFile()) {
        // Handle collection root files
        if (path.normalize(dirPath) === path.normalize(collectionPath)) {
          if (entry.name === 'collection.bru' || entry.name === 'opencollection.yml') {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              const parsed = await parseCollection(content, { format });

              if (format === 'yml') {
                root = parsed.collectionRoot;
                const ymlBrunoConfig = parsed.brunoConfig;
                if (ymlBrunoConfig) {
                  const transformedConfig = await transformBrunoConfigAfterRead(ymlBrunoConfig, collectionPath);
                  setBrunoConfig(collectionUid, transformedConfig);
                }
              } else {
                root = parsed;
              }

              if (root) {
                hydrateCollectionRootWithUuid(root);
              }
            } catch (err) {
              console.error('Error parsing collection root:', err);
            }
            continue;
          }

          // Handle bruno.json at root
          if (entry.name === 'bruno.json') {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              let config = JSON.parse(content);
              config = await transformBrunoConfigAfterRead(config, collectionPath);
              setBrunoConfig(collectionUid, config);
            } catch (err) {
              console.error('Error parsing bruno.json:', err);
            }
            continue;
          }
        }

        // Skip folder root files (already handled when processing the directory)
        if (entry.name === `folder.${format}`) {
          continue;
        }

        // Parse request files
        if (hasRequestExtension(fullPath, format)) {
          try {
            const item = await parseRequestFile(fullPath, format);
            items.push(item);
          } catch (error) {
            console.error(`Error parsing request file ${fullPath}:`, error);
          }
        }
      }
    }

    return items;
  };

  /**
   * Parse all environment files in the environments directory.
   */
  const parseEnvironmentsDirectory = async (envDirPath, collectionPath) => {
    let entries;
    try {
      entries = fs.readdirSync(envDirPath, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!hasRequestExtension(entry.name, format)) continue;

      const fullPath = path.join(envDirPath, entry.name);
      try {
        const envData = await parseEnvironmentFile(fullPath, collectionPath);
        environments.push(envData);
      } catch (error) {
        console.error(`Error parsing environment file ${fullPath}:`, error);
      }
    }
  };

  const items = await buildItemsForDirectory(collectionPath);

  // Add depth to items (replicating what the frontend does)
  const addDepth = (items, depth = 1) => {
    for (const item of items) {
      item.depth = depth;
      if (item.items && item.items.length) {
        addDepth(item.items, depth + 1);
      }
    }
  };
  addDepth(items);

  return { items, environments, root };
};

/**
 * Apply a snap diff to an existing cached tree.
 * Re-parses only the added/modified files and removes deleted ones.
 * Returns the updated { items, environments, root }.
 */
const patchCollectionTree = async (cachedTree, collectionPath, collectionUid, brunoConfig, snapStatus) => {
  const format = getCollectionFormat(collectionPath);
  const envDirectory = path.join(collectionPath, 'environments');
  let { items, environments, root } = cachedTree;

  // Helper: find the parent items array and index for a given file pathname
  const findItemInTree = (itemsArray, pathname) => {
    for (let i = 0; i < itemsArray.length; i++) {
      if (itemsArray[i].pathname === pathname) {
        return { parent: itemsArray, index: i };
      }
      if (itemsArray[i].items) {
        const found = findItemInTree(itemsArray[i].items, pathname);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper: get or create the folder chain for a file path, returns the items array to insert into
  const getParentItems = (filePath) => {
    const relativePath = path.relative(collectionPath, path.dirname(filePath));
    if (!relativePath) return items;

    const segments = relativePath.split(path.sep);
    let currentItems = items;

    for (const segment of segments) {
      let folder = currentItems.find((i) => i.type === 'folder' && i.filename === segment);
      if (!folder) {
        folder = {
          uid: getRequestUid(path.join(collectionPath, ...segments.slice(0, segments.indexOf(segment) + 1))),
          pathname: path.join(collectionPath, ...segments.slice(0, segments.indexOf(segment) + 1)),
          name: segment,
          filename: segment,
          collapsed: true,
          type: 'folder',
          isTransient: false,
          items: []
        };
        currentItems.push(folder);
      }
      currentItems = folder.items;
    }

    return currentItems;
  };

  // Helper: check if a pathname is an environment file
  const isEnvFile = (pathname) => {
    return path.normalize(path.dirname(pathname)) === path.normalize(envDirectory);
  };

  // Helper: check if a pathname is the collection root file
  const isCollectionRoot = (pathname) => {
    const basename = path.basename(pathname);
    const dirname = path.dirname(pathname);
    return path.normalize(dirname) === path.normalize(collectionPath)
      && (basename === 'collection.bru' || basename === 'opencollection.yml');
  };

  // Helper: check if a pathname is a folder root file
  const isFolderRoot = (pathname) => {
    return path.basename(pathname) === `folder.${format}`;
  };

  // Helper: check if a pathname is bruno.json
  const isBrunoJson = (pathname) => {
    const basename = path.basename(pathname);
    const dirname = path.dirname(pathname);
    return path.normalize(dirname) === path.normalize(collectionPath) && basename === 'bruno.json';
  };

  // Process deleted files
  for (const pathname of snapStatus.deleted) {
    if (isEnvFile(pathname)) {
      const uid = getRequestUid(pathname);
      environments = environments.filter((e) => e.uid !== uid);
    } else if (!isCollectionRoot(pathname) && !isFolderRoot(pathname) && !isBrunoJson(pathname)) {
      const found = findItemInTree(items, pathname);
      if (found) {
        found.parent.splice(found.index, 1);
      }
    }
  }

  // Process added + modified files (same logic — re-parse and upsert)
  const filesToProcess = [...snapStatus.added, ...snapStatus.modified];
  for (const pathname of filesToProcess) {
    try {
      if (isEnvFile(pathname)) {
        if (!fs.existsSync(pathname)) continue;
        const envData = await parseEnvironmentFile(pathname, collectionPath);
        const existingIdx = environments.findIndex((e) => e.uid === envData.uid);
        if (existingIdx >= 0) {
          environments[existingIdx] = envData;
        } else {
          environments.push(envData);
        }
        continue;
      }

      if (isCollectionRoot(pathname)) {
        if (!fs.existsSync(pathname)) continue;
        const content = fs.readFileSync(pathname, 'utf8');
        const parsed = await parseCollection(content, { format });
        if (format === 'yml') {
          root = parsed.collectionRoot;
          if (parsed.brunoConfig) {
            const transformedConfig = await transformBrunoConfigAfterRead(parsed.brunoConfig, collectionPath);
            setBrunoConfig(collectionUid, transformedConfig);
          }
        } else {
          root = parsed;
        }
        if (root) {
          hydrateCollectionRootWithUuid(root);
        }
        continue;
      }

      if (isFolderRoot(pathname)) {
        if (!fs.existsSync(pathname)) continue;
        const content = fs.readFileSync(pathname, 'utf8');
        const folderData = await parseFolder(content, { format });
        const folderPath = path.dirname(pathname);
        const found = findItemInTree(items, folderPath);
        if (found) {
          const folder = found.parent[found.index];
          if (folderData?.meta?.name) folder.name = folderData.meta.name;
          if (folderData?.meta?.seq) folder.seq = folderData.meta.seq;
          folder.root = folderData;
          hydrateCollectionRootWithUuid(folder.root);
        }
        continue;
      }

      if (isBrunoJson(pathname)) {
        if (!fs.existsSync(pathname)) continue;
        const content = fs.readFileSync(pathname, 'utf8');
        let config = JSON.parse(content);
        config = await transformBrunoConfigAfterRead(config, collectionPath);
        setBrunoConfig(collectionUid, config);
        continue;
      }

      if (hasRequestExtension(pathname, format)) {
        if (!fs.existsSync(pathname)) continue;
        const item = await parseRequestFile(pathname, format);
        const found = findItemInTree(items, pathname);
        if (found) {
          // Update existing item
          found.parent[found.index] = { ...found.parent[found.index], ...item };
        } else {
          // Add new item to parent folder
          const parentItems = getParentItems(pathname);
          parentItems.push(item);
        }
      }
    } catch (error) {
      console.error(`[snap] error patching file ${pathname}:`, error);
    }
  }

  // Recalculate depth
  const addDepth = (items, depth = 1) => {
    for (const item of items) {
      item.depth = depth;
      if (item.items && item.items.length) {
        addDepth(item.items, depth + 1);
      }
    }
  };
  addDepth(items);

  return { items, environments, root };
};

module.exports = { buildCollectionTree, patchCollectionTree };
