const { fs: memfs, vol } = require('memfs');
const realFs = require('fs');
const path = require('path');

// Map to store memfs instances per sandbox collection UID
const virtualFsMap = new Map();

// Map to store collection UID by virtual path prefix
const collectionUidByPath = new Map();

/**
 * Check if a pathname is a virtual (sandbox) path
 * @param {string} pathname - The pathname to check
 * @returns {boolean} - True if the path is virtual
 */
const isVirtualPath = (pathname) => {
  if (!pathname || typeof pathname !== 'string') {
    return false;
  }
  return pathname.startsWith('/sandbox/');
};

/**
 * Extract collection UID from a virtual path
 * @param {string} pathname - The virtual pathname
 * @returns {string|null} - The collection UID or null
 */
const getCollectionUidFromPath = (pathname) => {
  if (!isVirtualPath(pathname)) {
    return null;
  }

  // Path format: /sandbox/root/filename.bru
  // For now, we only support one sandbox with UID 'sandbox'
  // If we need multiple sandboxes later, we can extend this
  if (pathname.startsWith('/sandbox/')) {
    return 'sandbox';
  }

  return null;
};

/**
 * Get or create a memfs instance for a sandbox collection
 * @param {string} collectionUid - The collection UID
 * @returns {Object} - The memfs filesystem instance
 */
const getVirtualFsForCollection = (collectionUid) => {
  if (!virtualFsMap.has(collectionUid)) {
    // Create a new memfs volume for this collection
    const { fs, vol: newVol } = require('memfs');

    // Initialize root directory structure
    newVol.mkdirSync('/sandbox/root', { recursive: true });

    virtualFsMap.set(collectionUid, fs);
    collectionUidByPath.set('/sandbox/', collectionUid);
  }

  return virtualFsMap.get(collectionUid);
};

/**
 * Get the appropriate filesystem (memfs or real fs) for a given pathname
 * @param {string} pathname - The pathname to check
 * @returns {Object} - The filesystem object (memfs or real fs)
 */
const getFsForPath = (pathname) => {
  if (isVirtualPath(pathname)) {
    const collectionUid = getCollectionUidFromPath(pathname);
    if (collectionUid) {
      return getVirtualFsForCollection(collectionUid);
    }
  }
  return realFs;
};

/**
 * Get the appropriate filesystem for a collection
 * @param {string} collectionUid - The collection UID
 * @param {string} collectionPathname - The collection pathname (can be null for sandbox)
 * @returns {Object} - The filesystem object (memfs or real fs)
 */
const getFsForCollection = (collectionUid, collectionPathname) => {
  // Check if it's sandbox by UID or pathname
  if (collectionUid === 'sandbox' || !collectionPathname || isVirtualPath(collectionPathname)) {
    return getVirtualFsForCollection(collectionUid || 'sandbox');
  }
  return realFs;
};

/**
 * Initialize virtual filesystem for sandbox collection
 * @param {string} collectionUid - The collection UID (should be 'sandbox')
 */
const initializeSandboxFs = (collectionUid = 'sandbox') => {
  getVirtualFsForCollection(collectionUid);
};

/**
 * Clear virtual filesystem for a collection (useful for cleanup)
 * @param {string} collectionUid - The collection UID
 */
const clearVirtualFs = (collectionUid) => {
  if (virtualFsMap.has(collectionUid)) {
    virtualFsMap.delete(collectionUid);
  }
};

/**
 * Wrapper functions that route to appropriate filesystem
 */
const readFileSync = (pathname, encoding) => {
  const fs = getFsForPath(pathname);
  return fs.readFileSync(pathname, encoding);
};

const writeFileSync = (pathname, data, options) => {
  const fs = getFsForPath(pathname);
  return fs.writeFileSync(pathname, data, options);
};

const existsSync = (pathname) => {
  const fs = getFsForPath(pathname);
  return fs.existsSync(pathname);
};

const mkdirSync = (pathname, options) => {
  const fs = getFsForPath(pathname);
  return fs.mkdirSync(pathname, options);
};

const readdirSync = (pathname, options) => {
  const fs = getFsForPath(pathname);
  return fs.readdirSync(pathname, options);
};

const statSync = (pathname) => {
  const fs = getFsForPath(pathname);
  return fs.statSync(pathname);
};

const lstatSync = (pathname) => {
  const fs = getFsForPath(pathname);
  return fs.lstatSync(pathname);
};

const unlinkSync = (pathname) => {
  const fs = getFsForPath(pathname);
  return fs.unlinkSync(pathname);
};

const rmdirSync = (pathname, options) => {
  const fs = getFsForPath(pathname);
  return fs.rmdirSync(pathname, options);
};

const renameSync = (oldPath, newPath) => {
  const fs = getFsForPath(oldPath);
  return fs.renameSync(oldPath, newPath);
};

const copyFileSync = (src, dest) => {
  const srcFs = getFsForPath(src);
  const destFs = getFsForPath(dest);

  // If both are same filesystem, use that
  if (srcFs === destFs) {
    return srcFs.copyFileSync(src, dest);
  }

  // Cross-filesystem copy: read from source, write to dest
  const data = srcFs.readFileSync(src);
  destFs.writeFileSync(dest, data);
};

module.exports = {
  isVirtualPath,
  getCollectionUidFromPath,
  getFsForPath,
  getFsForCollection,
  initializeSandboxFs,
  clearVirtualFs,
  // Wrapper functions
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  lstatSync,
  unlinkSync,
  rmdirSync,
  renameSync,
  copyFileSync
};
