import { escapeMarkdownSpecialCharacters } from '../escapeMarkdownSpecialCharacters';

describe('escapeMarkdownSpecialCharacters()', () => {
  test('Basic Test', () => {
    expect(escapeMarkdownSpecialCharacters('__tests__/test.stories.tsx')).toEqual('\\_\\_tests\\_\\_/test.stories.tsx');
  });
});