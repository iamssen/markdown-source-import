"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const chalk_1 = __importDefault(require("chalk"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const minimist_1 = __importDefault(require("minimist"));
const path_1 = __importDefault(require("path"));
const promise_1 = __importDefault(require("simple-git/promise"));
const createTitle_1 = require("./createTitle");
const glob_promise_1 = require("./glob-promise");
const regex_1 = require("./regex");
const GIT_ADD = 'git-add';
module.exports = async function sourceImport(nodeArgv, { cwd = process.cwd() } = {}) {
    const gitEnabled = await fs_extra_1.default.pathExists(path_1.default.join(cwd, '.git'));
    const argv = minimist_1.default(nodeArgv, { boolean: [GIT_ADD] });
    const patterns = argv._;
    const gitAdd = gitEnabled && argv[GIT_ADD] === true;
    const globOptions = {
        cwd,
        ignore: [
            '**/node_modules/**',
            './node_modules/**',
        ],
    };
    const markdownFiles = []
        .concat(...(await Promise.all(patterns.map(p => glob_promise_1.glob(p, globOptions)))))
        .map(p => path_1.default.join(cwd, p));
    for await (const markdownFile of markdownFiles) {
        const markdownFileExists = await fs_extra_1.default.pathExists(markdownFile);
        if (!markdownFileExists) {
            continue;
        }
        try {
            const markdownSource = await fs_extra_1.default.readFile(markdownFile, { encoding: 'utf8' });
            const markdownFileDirname = path_1.default.dirname(markdownFile);
            const lines = markdownSource.split('\n');
            const exportMarkdownLines = [];
            let importMatched = undefined;
            let transformed = false;
            for (const line of lines) {
                const matched = regex_1.match(line);
                if (matched) {
                    exportMarkdownLines.push(line);
                    importMatched = matched;
                    continue;
                }
                if (importMatched && regex_1.endPattern.test(line)) {
                    const sourceFiles = (await glob_promise_1.glob(importMatched.pattern, { cwd: markdownFileDirname }))
                        .map(p => path_1.default.join(markdownFileDirname, p));
                    for await (const sourceFile of sourceFiles) {
                        const ext = path_1.default.extname(sourceFile);
                        const sourceFileExists = await fs_extra_1.default.pathExists(sourceFile);
                        if (sourceFileExists) {
                            const source = await fs_extra_1.default.readFile(sourceFile, { encoding: 'utf8' });
                            if (importMatched.titleTag) {
                                exportMarkdownLines.push('', createTitle_1.createTitle(path_1.default.relative(markdownFileDirname, sourceFile), importMatched.titleTag), '');
                            }
                            const importSource = Array.isArray(importMatched.slice)
                                ? source.split('\n').slice(...importMatched.slice).join('\n')
                                : source;
                            exportMarkdownLines.push('', '```' + ext.substring(1), importSource, '```', '');
                        }
                        else {
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
                const nextSource = exportMarkdownLines.join('\n');
                if (markdownSource !== nextSource) {
                    await fs_extra_1.default.writeFile(markdownFile, nextSource, { encoding: 'utf8' });
                    if (gitAdd) {
                        await promise_1.default(cwd).add(markdownFile);
                    }
                }
            }
        }
        catch (error) {
            console.log(chalk_1.default.red.underline(`${markdownFile} is not processed!`));
            console.log(error.toString());
        }
    }
};
//# sourceMappingURL=index.js.map