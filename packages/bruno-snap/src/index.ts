import * as fs from 'fs';
import * as path from 'path';
import { Snapshot, SnapStatus } from './types';

export { Snapshot, SnapStatus, FileEntry } from './types';

const DEFAULT_IGNORES = ['node_modules', '.git'];
const MAX_DEPTH = 20;

/**
 * Recursively walk a directory and build a snapshot of all files.
 * Returns a map of absolute file paths to their mtime and size.
 */
function walkDirectory(dirPath: string, ignores: string[], depth: number = 0): Snapshot {
  if (depth > MAX_DEPTH) {
    return {};
  }

  const snapshot: Snapshot = {};
  let entries: fs.Dirent[];

  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return snapshot;
  }

  for (const entry of entries) {
    if (ignores.includes(entry.name)) {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const subSnapshot = walkDirectory(fullPath, ignores, depth + 1);
      Object.assign(snapshot, subSnapshot);
    } else if (entry.isFile()) {
      try {
        const stat = fs.statSync(fullPath);
        snapshot[fullPath] = {
          mtime: stat.mtimeMs,
          size: stat.size
        };
      } catch {
        // File may have been deleted between readdir and stat
      }
    }
  }

  return snapshot;
}

/**
 * Initialize a snap.json for the given collection path.
 * Walks the entire directory tree and writes the snapshot.
 */
function init(collectionPath: string, snapFilePath: string, ignores: string[] = []): Snapshot {
  const allIgnores = [...DEFAULT_IGNORES, ...ignores];
  const snapshot = walkDirectory(collectionPath, allIgnores);

  const snapDir = path.dirname(snapFilePath);
  fs.mkdirSync(snapDir, { recursive: true });
  fs.writeFileSync(snapFilePath, JSON.stringify(snapshot, null, 2), 'utf-8');

  return snapshot;
}

/**
 * Compare the current filesystem state against the stored snapshot.
 * Returns lists of added, modified, and deleted file paths.
 */
function status(collectionPath: string, snapFilePath: string, ignores: string[] = []): SnapStatus {
  const allIgnores = [...DEFAULT_IGNORES, ...ignores];
  const currentSnapshot = walkDirectory(collectionPath, allIgnores);

  let previousSnapshot: Snapshot = {};
  try {
    const raw = fs.readFileSync(snapFilePath, 'utf-8');
    previousSnapshot = JSON.parse(raw);
  } catch {
    // No previous snapshot — everything is added
  }

  const added: string[] = [];
  const modified: string[] = [];
  const deleted: string[] = [];

  // Check current files against previous snapshot
  for (const filePath of Object.keys(currentSnapshot)) {
    const prev = previousSnapshot[filePath];
    if (!prev) {
      added.push(filePath);
    } else if (prev.mtime !== currentSnapshot[filePath].mtime || prev.size !== currentSnapshot[filePath].size) {
      modified.push(filePath);
    }
  }

  // Check for deleted files
  for (const filePath of Object.keys(previousSnapshot)) {
    if (!currentSnapshot[filePath]) {
      deleted.push(filePath);
    }
  }

  return { added, modified, deleted };
}

/**
 * Save the current filesystem state as the new snapshot.
 * This is equivalent to "committing" the current state.
 */
function add(collectionPath: string, snapFilePath: string, ignores: string[] = []): Snapshot {
  return init(collectionPath, snapFilePath, ignores);
}

export const snap = { init, status, add };
