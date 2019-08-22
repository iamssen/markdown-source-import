"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const chalk_1 = __importDefault(require("chalk"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const glob_promise_1 = require("./glob-promise");
const start = /^<!-- import ((\.\.\/|[a-zA-Z0-9_/\-\\])*\.[a-zA-Z0-9]+) -->/;
const end = /^<!-- importend -->/;
module.exports = async function sourceImport(pattern, { cwd = process.cwd() } = {}) {
    const patterns = typeof pattern === 'string' ? [pattern] : pattern;
    const files = await Promise.all(patterns.map(p => glob_promise_1.glob(p, { cwd })));
    for await (const file of files.flat()) {
        const fileExists = await fs_extra_1.default.pathExists(file);
        if (!fileExists) {
            continue;
        }
        try {
            const source = await fs_extra_1.default.readFile(file, { encoding: 'utf8' });
            const dirname = path_1.default.dirname(file);
            const lines = source.split('\n');
            const replacedLines = [];
            let importFile = null;
            for (const line of lines) {
                const match = line.match(start);
                if (match) {
                    replacedLines.push(line);
                    importFile = match[1];
                    continue;
                }
                if (importFile && end.test(line)) {
                    const importFileFullPath = path_1.default.join(dirname, importFile);
                    const ext = path_1.default.extname(importFile);
                    const importFileExists = await fs_extra_1.default.pathExists(importFileFullPath);
                    if (importFileExists) {
                        const importFileSource = await fs_extra_1.default.readFile(importFileFullPath, { encoding: 'utf8' });
                        replacedLines.push('```' + ext.substring(1), importFileSource, '```');
                    }
                    else {
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
            const nextSource = replacedLines.join('\n');
            await fs_extra_1.default.writeFile(file, nextSource, { encoding: 'utf8' });
        }
        catch (error) {
            console.log(chalk_1.default.red.underline(`${file} is not processed!`));
            console.log(error.toString());
        }
    }
};
//# sourceMappingURL=index.js.map