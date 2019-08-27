import { createTitle } from '../createTitle';

describe('createTitle()', () => {
  test('Basic', () => {
    expect(createTitle('__stories__/file.test.tsx', 'h3')).toEqual('### \\_\\_stories\\_\\_/file.test.tsx');
  });
});