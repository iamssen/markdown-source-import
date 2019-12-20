import { matchImportStart, matchIndexStart } from '../regex';

describe('regex', () => {
  test('Test import start', () => {
    [
      '<!-- import test.tsx -->',
      '<!--import test.tsx-->',
      '<!--      import test.tsx        -->',
    ].forEach(line => {
      expect(matchImportStart(line)).toEqual({
        pattern: 'test.tsx',
        titleTag: undefined,
        slice: undefined,
      });
    });
    
    [
      '<!-- import test.tsx --slice 30:45 -->',
      '<!--import test.tsx --slice 30:45-->',
      '<!--      import test.tsx      --slice 30:45   -->',
    ].forEach(line => {
      expect(matchImportStart(line)).toEqual({
        pattern: 'test.tsx',
        titleTag: undefined,
        slice: [30, 45],
      });
    });
    
    [
      '<!-- import test.tsx --slice 30:45 --title-tag h4 -->',
      '<!--import test.tsx  --title-tag h4 --slice 30:45-->',
      '<!--      import test.tsx    --title-tag h4   --slice 30:45   -->',
    ].forEach(line => {
      expect(matchImportStart(line)).toEqual({
        pattern: 'test.tsx',
        titleTag: 'h4',
        slice: [30, 45],
      });
    });
    
    [
      '<!-- import test.tsx -->',
      '<!--import test.tsx-->',
      '<!--      import test.tsx        -->',
    ].forEach(line => {
      expect(matchImportStart(line)).toEqual({
        pattern: 'test.tsx',
        titleTag: undefined,
        slice: undefined,
      });
    });
    
    [
      '<!-- import **/*.{js,jsx,ts,tsx} -->',
      '<!--import **/*.{js,jsx,ts,tsx}-->',
      '<!--      import **/*.{js,jsx,ts,tsx}        -->',
    ].forEach(line => {
      expect(matchImportStart(line)).toEqual({
        pattern: '**/*.{js,jsx,ts,tsx}',
        titleTag: undefined,
        slice: undefined,
      });
    });
    
    [
      '<!-- import src/*.test.ts --slice 30:45 --title-tag h4 -->',
      '<!--import src/*.test.ts  --title-tag h4 --slice 30:45-->',
      '<!--      import src/*.test.ts    --title-tag h4   --slice 30:45   -->',
    ].forEach(line => {
      expect(matchImportStart(line)).toEqual({
        pattern: 'src/*.test.ts',
        titleTag: 'h4',
        slice: [30, 45],
      });
    });
  });
  
  test('Test index start', () => {
    [
      '<!-- index test.md -->',
      '<!--index test.md-->',
      '<!--      index test.md        -->',
    ].forEach(line => {
      expect(matchIndexStart(line)).toEqual({
        pattern: 'test.md',
        tree: false,
      });
    });
    
    [
      '<!-- index test.md --tree -->',
      '<!--index test.md --tree-->',
      '<!--      index test.md      --tree  -->',
    ].forEach(line => {
      expect(matchIndexStart(line)).toEqual({
        pattern: 'test.md',
        tree: true,
      });
    });
    
    [
      '<!-- index **/*.{md,js,jsx,ts,tsx} -->',
      '<!--index **/*.{md,js,jsx,ts,tsx}-->',
      '<!--      index **/*.{md,js,jsx,ts,tsx}        -->',
    ].forEach(line => {
      expect(matchIndexStart(line)).toEqual({
        pattern: '**/*.{md,js,jsx,ts,tsx}',
        tree: false,
      });
    });
  });
});