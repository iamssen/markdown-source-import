import path from 'path';
import sourceImport from '../';

describe('sourceImport', () => {
  test('Basic', async () => {
    await sourceImport(['test.md'], {cwd: path.join(__dirname, '../../fixtures')});
  });
});