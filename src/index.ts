import chalk from 'chalk';
import fs from 'fs-extra';
import { IOptions } from 'glob';
import minimist, { ParsedArgs } from 'minimist';
import path from 'path';
import git from 'simple-git/promise';
import { createTitle } from './createTitle';
import { glob } from './glob-promise';
import {
  importEndPattern,
  ImportParams,
  indexEndPattern,
  IndexParams,
  matchImportStart,
  matchIndexStart,
} from './regex';

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
  
  for (const markdownFile of markdownFiles) {
    const markdownFileExists: boolean = await fs.pathExists(markdownFile);
    
    if (!markdownFileExists) {
      continue;
    }
    
    try {
      const markdownSource: string = await fs.readFile(markdownFile, {encoding: 'utf8'});
      const markdownFileDirname: string = path.dirname(markdownFile);
      const lines: string[] = markdownSource.split('\n');
      const exportMarkdownLines: string[] = [];
      let importParams: ImportParams | undefined = undefined;
      let indexParams: IndexParams | undefined = undefined;
      let transformed: boolean = false;
      
      for (const line of lines) {
        const importParams1: ImportParams | undefined = matchImportStart(line);
        const indexParams1: IndexParams | undefined = matchIndexStart(line);
        
        // start
        if (importParams1) {
          exportMarkdownLines.push(line);
          importParams = importParams1;
          continue;
        } else if (indexParams1) {
          exportMarkdownLines.push(line);
          indexParams = indexParams1;
          continue;
        }
        
        // end
        if (importParams && importEndPattern.test(line)) {
          // insert source files to the export lines
          const sourceFiles: string[] = (await glob(importParams.pattern, {cwd: markdownFileDirname})).map(p => path.join(markdownFileDirname, p));
          
          for (const sourceFile of sourceFiles) {
            const ext: string = path.extname(sourceFile);
            const sourceFileExists: boolean = await fs.pathExists(sourceFile);
            
            if (sourceFileExists) {
              const source: string = await fs.readFile(sourceFile, {encoding: 'utf8'});
              if (importParams.titleTag) {
                exportMarkdownLines.push(
                  '',
                  createTitle(path.relative(markdownFileDirname, sourceFile), importParams.titleTag),
                  '',
                );
              }
              
              const importSource: string = Array.isArray(importParams.slice)
                ? source.split('\n').slice(...importParams.slice).join('\n')
                : source;
              
              exportMarkdownLines.push(
                '',
                '```' + ext.substring(1),
                importSource,
                '```',
                '',
              );
            } else {
              exportMarkdownLines.push('<!-- undefined source file -->');
            }
            
            transformed = true;
          }
          
          // insert the end line to the export lines
          exportMarkdownLines.push(line);
          importParams = undefined;
          
          continue;
        } else if (indexParams && indexEndPattern.test(line)) {
          // insert index list to the export lines
          const sourceFiles: string[] = (await glob(indexParams.pattern, {cwd: markdownFileDirname})).map(p => path.join(markdownFileDirname, p));
          
          exportMarkdownLines.push('');
          
          for (const sourceFile of sourceFiles) {
            const relativePath: string = path.relative(markdownFileDirname, sourceFile);
            exportMarkdownLines.push(`- [${relativePath}](${relativePath})`);
          }
          
          exportMarkdownLines.push('');
          
          // insert the end line to the export lines
          exportMarkdownLines.push(line);
          indexParams = undefined;
          
          continue;
        }
        
        // ignore next lines until end line pattern appear
        
        // if there are no matching, insert this line to the export lines
        if (!importParams && !indexParams) {
          exportMarkdownLines.push(line);
        }
      }
      
      if (importParams || indexParams) {
        importParams = undefined;
        indexParams = undefined;
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