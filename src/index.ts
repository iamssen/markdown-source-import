import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { glob } from './glob-promise';

const start: RegExp = /^<!-- import ((\.\.\/|[a-zA-Z0-9_/\-\\])*\.[a-zA-Z0-9]+) -->/;
const end: RegExp = /^<!-- importend -->/;

export = async function sourceImport(pattern: string | string[], {cwd = process.cwd()}: {cwd?: string} = {}) {
  const patterns: string[] = typeof pattern === 'string' ? [pattern] : pattern;
  
  const files: string[][] = await Promise.all(patterns.map(p => glob(p, {cwd})));
  
  for await (const file of files.flat()) {
    const fileExists: boolean = await fs.pathExists(file);
    
    if (!fileExists) {
      continue;
    }
    
    try {
      const source: string = await fs.readFile(file, {encoding: 'utf8'});
      const dirname: string = path.dirname(file);
      const lines: string[] = source.split('\n');
      const replacedLines: string[] = [];
      let importFile: string | null = null;
      
      for (const line of lines) {
        const match: RegExpMatchArray | null = line.match(start);
        
        if (match) {
          replacedLines.push(line);
          importFile = match[1];
          continue;
        }
        
        if (importFile && end.test(line)) {
          const importFileFullPath: string = path.join(dirname, importFile);
          const ext: string = path.extname(importFile);
          const importFileExists: boolean = await fs.pathExists(importFileFullPath);
          
          if (importFileExists) {
            const importFileSource: string = await fs.readFile(importFileFullPath, {encoding: 'utf8'});
            
            replacedLines.push(
              '```' + ext.substring(1),
              importFileSource,
              '```',
            );
          } else {
            replacedLines.push('<!-- undefined source file -->');
          }
          
          replacedLines.push(line);
          
          importFile = null;
          continue;
        }
        
        if (!importFile) {
          replacedLines.push(line);
        }
      }
      
      const nextSource: string = replacedLines.join('\n');
      
      await fs.writeFile(file, nextSource, {encoding: 'utf8'});
    } catch (error) {
      console.log(chalk.red.underline(`${file} is not processed!`));
      console.log(error.toString());
    }
  }
}