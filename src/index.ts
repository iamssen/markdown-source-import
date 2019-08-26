import chalk from 'chalk';
import fs from 'fs-extra';
import { IOptions } from 'glob';
import minimist, { ParsedArgs } from 'minimist';
import path from 'path';
import git from 'simple-git/promise';
import { escapeMarkdownSpecialCharacters } from './escapeMarkdownSpecialCharacters';
import { glob } from './glob-promise';
import { endPattern, ImportMatch, match } from './regex';

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
  
  const markdownFiles: string[] = ([] as string[])
    .concat(...(await Promise.all(patterns.map(p => glob(p, globOptions)))))
    .map(p => path.join(cwd, p));
  
  for await (const markdownFile of markdownFiles) {
    const markdownFileExists: boolean = await fs.pathExists(markdownFile);
    
    if (!markdownFileExists) {
      continue;
    }
    
    try {
      const markdownSource: string = await fs.readFile(markdownFile, {encoding: 'utf8'});
      const markdownFileDirname: string = path.dirname(markdownFile);
      const lines: string[] = markdownSource.split('\n');
      const exportMarkdownLines: string[] = [];
      let importMatched: ImportMatch | undefined = undefined;
      let transformed: boolean = false;
      
      for (const line of lines) {
        const matched: ImportMatch | undefined = match(line);
        
        if (matched) {
          exportMarkdownLines.push(line);
          importMatched = matched;
          continue;
        }
        
        if (importMatched && endPattern.test(line)) {
          const sourceFiles: string[] = (await glob(importMatched.pattern, {cwd: markdownFileDirname}))
            .map(p => path.join(markdownFileDirname, p));
          
          for await (const sourceFile of sourceFiles) {
            const ext: string = path.extname(sourceFile);
            const sourceFileExists: boolean = await fs.pathExists(sourceFile);
            
            if (sourceFileExists) {
              const source: string = await fs.readFile(sourceFile, {encoding: 'utf8'});
              const importSource: string = Array.isArray(importMatched.slice)
                ? source.split('\n').slice(...importMatched.slice).join('\n')
                : source;
              
              if (importMatched.titleTag) {
                exportMarkdownLines.push(`<${importMatched.titleTag}>${escapeMarkdownSpecialCharacters(path.relative(markdownFileDirname, sourceFile))}</${importMatched.titleTag}>`);
              }
              
              exportMarkdownLines.push(
                '```' + ext.substring(1),
                importSource,
                '```',
              );
            } else {
              exportMarkdownLines.push('<!-- undefined source file -->');
            }
            
            transformed = true;
          }
          
          exportMarkdownLines.push(line);
          importMatched = undefined;
          
          continue;
        }
        
        if (!importMatched) {
          exportMarkdownLines.push(line);
        }
      }
      
      if (importMatched) {
        importMatched = undefined;
        transformed = false;
      }
      
      if (transformed) {
        const nextSource: string = exportMarkdownLines.join('\n');
        
        if (markdownSource !== nextSource) {
          await fs.writeFile(markdownFile, nextSource, {encoding: 'utf8'});
          
          if (gitAdd) {
            await git(cwd).add(markdownFile);
          }
        }
        
      }
    } catch (error) {
      console.log(chalk.red.underline(`${markdownFile} is not processed!`));
      console.log(error.toString());
    }
  }
}