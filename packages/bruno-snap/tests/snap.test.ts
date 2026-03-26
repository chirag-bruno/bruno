import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { snap } from '../src/index';

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'bruno-snap-test-'));
}

function writeFile(dir: string, relativePath: string, content: string): string {
  const fullPath = path.join(dir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf-8');
  return fullPath;
}

function cleanup(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe('snap', () => {
  let collectionDir: string;
  let snapDir: string;
  let snapFilePath: string;

  beforeEach(() => {
    collectionDir = createTempDir();
    snapDir = createTempDir();
    snapFilePath = path.join(snapDir, 'snap.json');
  });

  afterEach(() => {
    cleanup(collectionDir);
    cleanup(snapDir);
  });

  describe('init', () => {
    it('should create snap.json with all files', () => {
      writeFile(collectionDir, 'request.bru', 'get { url: https://example.com }');
      writeFile(collectionDir, 'subfolder/nested.bru', 'post { url: https://example.com }');

      const snapshot = snap.init(collectionDir, snapFilePath);

      const paths = Object.keys(snapshot);
      expect(paths).toHaveLength(2);
      expect(paths.some(p => p.endsWith('request.bru'))).toBe(true);
      expect(paths.some(p => p.endsWith('nested.bru'))).toBe(true);

      // Verify snap.json was written
      expect(fs.existsSync(snapFilePath)).toBe(true);
      const written = JSON.parse(fs.readFileSync(snapFilePath, 'utf-8'));
      expect(Object.keys(written)).toHaveLength(2);
    });

    it('should ignore node_modules and .git by default', () => {
      writeFile(collectionDir, 'request.bru', 'content');
      writeFile(collectionDir, 'node_modules/pkg/index.js', 'module');
      writeFile(collectionDir, '.git/config', 'gitconfig');

      const snapshot = snap.init(collectionDir, snapFilePath);

      expect(Object.keys(snapshot)).toHaveLength(1);
      expect(Object.keys(snapshot)[0]).toContain('request.bru');
    });

    it('should respect custom ignores', () => {
      writeFile(collectionDir, 'request.bru', 'content');
      writeFile(collectionDir, 'temp/draft.bru', 'draft');

      const snapshot = snap.init(collectionDir, snapFilePath, ['temp']);

      expect(Object.keys(snapshot)).toHaveLength(1);
    });

    it('should store mtime and size for each file', () => {
      const content = 'get { url: https://example.com }';
      writeFile(collectionDir, 'request.bru', content);

      const snapshot = snap.init(collectionDir, snapFilePath);
      const entry = Object.values(snapshot)[0];

      expect(entry).toHaveProperty('mtime');
      expect(entry).toHaveProperty('size');
      expect(typeof entry.mtime).toBe('number');
      expect(entry.size).toBe(Buffer.byteLength(content));
    });
  });

  describe('status', () => {
    it('should detect added files', () => {
      writeFile(collectionDir, 'existing.bru', 'content');
      snap.init(collectionDir, snapFilePath);

      writeFile(collectionDir, 'new-request.bru', 'new content');

      const result = snap.status(collectionDir, snapFilePath);
      expect(result.added).toHaveLength(1);
      expect(result.added[0]).toContain('new-request.bru');
      expect(result.modified).toHaveLength(0);
      expect(result.deleted).toHaveLength(0);
    });

    it('should detect modified files', (done) => {
      const filePath = writeFile(collectionDir, 'request.bru', 'original');
      snap.init(collectionDir, snapFilePath);

      // Need a small delay so mtime changes
      setTimeout(() => {
        fs.writeFileSync(filePath, 'modified content');

        const result = snap.status(collectionDir, snapFilePath);
        expect(result.modified).toHaveLength(1);
        expect(result.modified[0]).toContain('request.bru');
        expect(result.added).toHaveLength(0);
        expect(result.deleted).toHaveLength(0);
        done();
      }, 50);
    });

    it('should detect deleted files', () => {
      const filePath = writeFile(collectionDir, 'request.bru', 'content');
      snap.init(collectionDir, snapFilePath);

      fs.unlinkSync(filePath);

      const result = snap.status(collectionDir, snapFilePath);
      expect(result.deleted).toHaveLength(1);
      expect(result.deleted[0]).toContain('request.bru');
      expect(result.added).toHaveLength(0);
      expect(result.modified).toHaveLength(0);
    });

    it('should treat all files as added when no snap.json exists', () => {
      writeFile(collectionDir, 'request.bru', 'content');

      const result = snap.status(collectionDir, snapFilePath);
      expect(result.added).toHaveLength(1);
      expect(result.modified).toHaveLength(0);
      expect(result.deleted).toHaveLength(0);
    });

    it('should detect mixed changes', (done) => {
      writeFile(collectionDir, 'keep.bru', 'keep');
      const modifyPath = writeFile(collectionDir, 'modify.bru', 'original');
      writeFile(collectionDir, 'delete.bru', 'to delete');
      snap.init(collectionDir, snapFilePath);

      setTimeout(() => {
        writeFile(collectionDir, 'added.bru', 'new');
        fs.writeFileSync(modifyPath, 'changed');
        fs.unlinkSync(path.join(collectionDir, 'delete.bru'));

        const result = snap.status(collectionDir, snapFilePath);
        expect(result.added).toHaveLength(1);
        expect(result.modified).toHaveLength(1);
        expect(result.deleted).toHaveLength(1);
        done();
      }, 50);
    });
  });

  describe('add', () => {
    it('should update snap.json with current state', () => {
      writeFile(collectionDir, 'request.bru', 'content');
      snap.init(collectionDir, snapFilePath);

      writeFile(collectionDir, 'new.bru', 'new');
      snap.add(collectionDir, snapFilePath);

      // After add, status should show no changes
      const result = snap.status(collectionDir, snapFilePath);
      expect(result.added).toHaveLength(0);
      expect(result.modified).toHaveLength(0);
      expect(result.deleted).toHaveLength(0);
    });
  });
});
