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
    it('should create an empty snap.json file', () => {
      snap.init(snapFilePath);

      expect(fs.existsSync(snapFilePath)).toBe(true);
      const content = JSON.parse(fs.readFileSync(snapFilePath, 'utf-8'));
      expect(content).toEqual({});
    });

    it('should create parent directories if they do not exist', () => {
      const nestedPath = path.join(snapDir, 'nested', 'deep', 'snap.json');

      snap.init(nestedPath);

      expect(fs.existsSync(nestedPath)).toBe(true);
    });
  });

  describe('status', () => {
    it('should show all files as added after init', () => {
      writeFile(collectionDir, 'request.bru', 'content');
      writeFile(collectionDir, 'subfolder/nested.bru', 'content');
      snap.init(snapFilePath);

      const result = snap.status(collectionDir, snapFilePath);
      expect(result.added).toHaveLength(2);
      expect(result.modified).toHaveLength(0);
      expect(result.deleted).toHaveLength(0);
    });

    it('should detect added files after add', () => {
      writeFile(collectionDir, 'existing.bru', 'content');
      snap.add(collectionDir, snapFilePath);

      writeFile(collectionDir, 'new-request.bru', 'new content');

      const result = snap.status(collectionDir, snapFilePath);
      expect(result.added).toHaveLength(1);
      expect(result.added[0]).toContain('new-request.bru');
      expect(result.modified).toHaveLength(0);
      expect(result.deleted).toHaveLength(0);
    });

    it('should detect modified files', (done) => {
      const filePath = writeFile(collectionDir, 'request.bru', 'original');
      snap.add(collectionDir, snapFilePath);

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
      snap.add(collectionDir, snapFilePath);

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

    it('should ignore node_modules and .git by default', () => {
      writeFile(collectionDir, 'request.bru', 'content');
      writeFile(collectionDir, 'node_modules/pkg/index.js', 'module');
      writeFile(collectionDir, '.git/config', 'gitconfig');
      snap.init(snapFilePath);

      const result = snap.status(collectionDir, snapFilePath);
      expect(result.added).toHaveLength(1);
      expect(result.added[0]).toContain('request.bru');
    });

    it('should respect custom ignores', () => {
      writeFile(collectionDir, 'request.bru', 'content');
      writeFile(collectionDir, 'temp/draft.bru', 'draft');
      snap.init(snapFilePath);

      const result = snap.status(collectionDir, snapFilePath, ['temp']);
      expect(result.added).toHaveLength(1);
      expect(result.added[0]).toContain('request.bru');
    });

    it('should detect mixed changes', (done) => {
      writeFile(collectionDir, 'keep.bru', 'keep');
      const modifyPath = writeFile(collectionDir, 'modify.bru', 'original');
      writeFile(collectionDir, 'delete.bru', 'to delete');
      snap.add(collectionDir, snapFilePath);

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
    it('should persist snapshot so status shows no changes', () => {
      writeFile(collectionDir, 'request.bru', 'content');
      snap.add(collectionDir, snapFilePath);

      const result = snap.status(collectionDir, snapFilePath);
      expect(result.added).toHaveLength(0);
      expect(result.modified).toHaveLength(0);
      expect(result.deleted).toHaveLength(0);
    });

    it('should write snap.json with file entries', () => {
      writeFile(collectionDir, 'request.bru', 'content');
      snap.add(collectionDir, snapFilePath);

      expect(fs.existsSync(snapFilePath)).toBe(true);
      const written = JSON.parse(fs.readFileSync(snapFilePath, 'utf-8'));
      expect(Object.keys(written)).toHaveLength(1);

      const entry = Object.values(written)[0] as any;
      expect(entry).toHaveProperty('mtime');
      expect(entry).toHaveProperty('hash');
    });
  });
});
