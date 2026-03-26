export interface FileEntry {
  mtime: number;
  hash: string;
}

export interface Snapshot {
  [absolutePath: string]: FileEntry;
}

export interface SnapStatus {
  added: string[];
  modified: string[];
  deleted: string[];
}
