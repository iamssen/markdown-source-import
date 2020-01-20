import path from 'path';
import sourceImport from '../';

describe('sourceImport', () => {
  test('Basic', async () => {
    await sourceImport(['test.md'], {cwd: path.join(__dirname, '../../fixtures')});
  });
  
  test('Index Only', async () => {
    await sourceImport(['test2.md'], {cwd: path.join(__dirname, '../../fixtures')});
  });
});