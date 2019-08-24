import { match } from '../regex';

describe('regex', () => {
  test('Test start', () => {
    [
      '<!-- import test.tsx -->',
      '<!--import test.tsx-->',
      '<!--      import test.tsx        -->',
    ].forEach(line => expect(match(line)).toEqual({
      pattern: 'test.tsx',
      titleTag: undefined,
      slice: undefined,
    }));
    
    [
      '<!-- import test.tsx --slice 30:45 -->',
      '<!--import test.tsx --slice 30:45-->',
      '<!--      import test.tsx      --slice 30:45   -->',
    ].forEach(line => expect(match(line)).toEqual({
      pattern: 'test.tsx',
      titleTag: undefined,
      slice: [30, 45],
    }));
    
    [
      '<!-- import test.tsx --slice 30:45 --title-tag h4 -->',
      '<!--import test.tsx  --title-tag h4 --slice 30:45-->',
      '<!--      import test.tsx    --title-tag h4   --slice 30:45   -->',
    ].forEach(line => expect(match(line)).toEqual({
      pattern: 'test.tsx',
      titleTag: 'h4',
      slice: [30, 45],
    }));
  
    [
      '<!-- import test.tsx -->',
      '<!--import test.tsx-->',
      '<!--      import test.tsx        -->',
    ].forEach(line => expect(match(line)).toEqual({
      pattern: 'test.tsx',
      titleTag: undefined,
      slice: undefined,
    }));
  
    [
      '<!-- import **/*.{js,jsx,ts,tsx} -->',
      '<!--import **/*.{js,jsx,ts,tsx}-->',
      '<!--      import **/*.{js,jsx,ts,tsx}        -->',
    ].forEach(line => expect(match(line)).toEqual({
      pattern: '**/*.{js,jsx,ts,tsx}',
      titleTag: undefined,
      slice: undefined,
    }));
  
    [
      '<!-- import src/*.test.ts --slice 30:45 --title-tag h4 -->',
      '<!--import src/*.test.ts  --title-tag h4 --slice 30:45-->',
      '<!--      import src/*.test.ts    --title-tag h4   --slice 30:45   -->',
    ].forEach(line => expect(match(line)).toEqual({
      pattern: 'src/*.test.ts',
      titleTag: 'h4',
      slice: [30, 45],
    }));
  });
});