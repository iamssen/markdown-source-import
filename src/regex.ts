import minimist, { Opts, ParsedArgs } from 'minimist';

export const startPattern: RegExp = /^<!--\s*import ((\.\.\/|[a-zA-Z0-9._/\\,!?*(|){}\[\]\-])*\.[a-zA-Z0-9,!?*(|){}\[\]\-]+\s*[\-a-z0-9: ]*)-->\s*$/;
export const endPattern: RegExp = /^<!--\s*importend\s*-->\s*$/;
export const slicePattern: RegExp = /([0-9]+):([0-9]+)/;

// <!-- import [pattern] [--slice 30:50] [--title-tag h4]
export interface ImportMatch {
  pattern: string;
  slice: [number, number] | undefined;
  titleTag: string | undefined;
}

const options: Opts = {
  boolean: ['hide-filename'],
};

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

export function match(line: string): ImportMatch | undefined {
  const matched: RegExpMatchArray | null = line.match(startPattern);
  
  if (matched) {
    const argv: ParsedArgs = minimist(matched[1].trim().split(' '), options);
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