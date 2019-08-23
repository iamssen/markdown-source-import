import path from 'path';
import sourceImport from '../';

describe('sourceImport', () => {
  test('Basic', async () => {
    await sourceImport([path.join(__dirname, '../../fixtures/test.md')]);
  });
});