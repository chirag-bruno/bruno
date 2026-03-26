export interface FileEntry {
  mtime: number;
  size: number;
}

export interface Snapshot {
  [absolutePath: string]: FileEntry;
}

export interface SnapStatus {
  added: string[];
  modified: string[];
  deleted: string[];
}
