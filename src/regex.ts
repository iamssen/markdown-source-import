import minimist, { ParsedArgs } from 'minimist';

export const importStartPattern: RegExp = /^<!--\s*import ((\.\.\/|[a-zA-Z0-9._/\\,!?*(|){}\[\]\-])*\.[a-zA-Z0-9,!?*(|){}\[\]\-]+\s*[\-a-z0-9: ]*)-->\s*$/;
export const importEndPattern: RegExp = /^<!--\s*importend\s*-->\s*$/;
export const slicePattern: RegExp = /([0-9]+):([0-9]+)/;
export const indexStartPattern: RegExp = /^<!--\s*index ((\.\.\/|[a-zA-Z0-9._/\\,!?*(|){}\[\]\-])*\.[a-zA-Z0-9,!?*(|){}\[\]\-]+\s*[\-a-z0-9: ]*)-->\s*$/;
export const indexEndPattern: RegExp = /^<!--\s*indexend\s*-->\s*$/;

// <!-- import [pattern] [--slice 30:50] [--title-tag h4]
export interface ImportParams {
  pattern: string;
  slice: [number, number] | undefined;
  titleTag: string | undefined;
}

// <!-- index [pattern] [--tree]
export interface IndexParams {
  pattern: string;
  tree: boolean;
}

function parseSlice(slice: string | undefined): [number, number] | undefined {
  if (typeof slice === 'string') {
    const matched: RegExpMatchArray | null = slice.match(slicePattern);
    
    if (matched) {
      const from: number = parseInt(matched[1], 10);
      const to: number = parseInt(matched[2], 10);
      
      if (!Number.isNaN(from) && !Number.isNaN(to)) {
        return [from, to];
      }
    }
  }
  
  return undefined;
}

export function matchImportStart(line: string): ImportParams | undefined {
  const matched: RegExpMatchArray | null = line.match(importStartPattern);
  
  if (matched) {
    const argv: ParsedArgs = minimist(matched[1].trim().split(' '));
    const [pattern] = argv._;
    const titleTag: string | undefined = argv['title-tag'] || undefined;
    const slice: [number, number] | undefined = parseSlice(argv['slice']);
    
    return {
      pattern,
      titleTag,
      slice,
    };
  }
  
  return undefined;
}

export function matchIndexStart(line: string): IndexParams | undefined {
  const matched: RegExpMatchArray | null = line.match(indexStartPattern);
  
  if (matched) {
    const argv: ParsedArgs = minimist(matched[1].trim().split(' '), {boolean: ['tree']});
    const [pattern] = argv._;
    const tree: boolean = argv['tree'] || false;
    
    return {
      pattern,
      tree,
    };
  }
}