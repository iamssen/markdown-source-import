import chalk from 'chalk';
import fs from 'fs-extra';
import { IOptions } from 'glob';
import path from 'path';
import { glob } from './glob-promise';
import minimist, { ParsedArgs } from 'minimist';
import git from 'simple-git/promise';

const start: RegExp = /^<!-- import ((\.\.\/|[a-zA-Z0-9._/\-\\])*\.[a-zA-Z0-9]+) -->/;
const end: RegExp = /^<!-- importend -->/;

const GIT_ADD: 'git-add' = 'git-add';

export = async function sourceImport(nodeArgv: string[], {cwd = process.cwd()}: {cwd?: string} = {}) {
  const gitEnabled: boolean = await fs.pathExists(path.join(cwd, '.git'));
  const argv: ParsedArgs = minimist(nodeArgv, {boolean: [GIT_ADD]});
  const patterns: string[] = argv._;
  const gitAdd: boolean = gitEnabled && argv[GIT_ADD] === true;
  
  const globOptions: IOptions = {
    cwd,
    ignore: [
      '**/node_modules/**',
      './node_modules/**',
    ],
  };
  
  const files: string[] = ([] as string[]).concat(...(await Promise.all(patterns.map(p => glob(p, globOptions)))));
  
  for await (const file of files) {
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
      let transformed: boolean = false;
      
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
          
          transformed = true;
          continue;
        }
        
        if (!importFile) {
          replacedLines.push(line);
        }
      }
      
      if (importFile) {
        transformed = false;
      }
      
      if (transformed) {
        const nextSource: string = replacedLines.join('\n');
        
        if (source !== nextSource) {
          await fs.writeFile(file, nextSource, {encoding: 'utf8'});

          if (gitAdd) {
            await git(cwd).add(file);
          }
        }
        
      }
    } catch (error) {
      console.log(chalk.red.underline(`${file} is not processed!`));
      console.log(error.toString());
    }
  }
}