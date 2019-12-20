"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
exports.importStartPattern = /^<!--\s*import ((\.\.\/|[a-zA-Z0-9._/\\,!?*(|){}\[\]\-])*\.[a-zA-Z0-9,!?*(|){}\[\]\-]+\s*[\-a-z0-9: ]*)-->\s*$/;
exports.importEndPattern = /^<!--\s*importend\s*-->\s*$/;
exports.slicePattern = /([0-9]+):([0-9]+)/;
exports.indexStartPattern = /^<!--\s*index ((\.\.\/|[a-zA-Z0-9._/\\,!?*(|){}\[\]\-])*\.[a-zA-Z0-9,!?*(|){}\[\]\-]+\s*[\-a-z0-9: ]*)-->\s*$/;
exports.indexEndPattern = /^<!--\s*indexend\s*-->\s*$/;
function parseSlice(slice) {
    if (typeof slice === 'string') {
        const matched = slice.match(exports.slicePattern);
        if (matched) {
            const from = parseInt(matched[1], 10);
            const to = parseInt(matched[2], 10);
            if (!Number.isNaN(from) && !Number.isNaN(to)) {
                return [from, to];
            }
        }
    }
    return undefined;
}
function matchImportStart(line) {
    const matched = line.match(exports.importStartPattern);
    if (matched) {
        const argv = minimist_1.default(matched[1].trim().split(' '));
        const [pattern] = argv._;
        const titleTag = argv['title-tag'] || undefined;
        const slice = parseSlice(argv['slice']);
        return {
            pattern,
            titleTag,
            slice,
        };
    }
    return undefined;
}
exports.matchImportStart = matchImportStart;
function matchIndexStart(line) {
    const matched = line.match(exports.indexStartPattern);
    if (matched) {
        const argv = minimist_1.default(matched[1].trim().split(' '), { boolean: ['tree'] });
        const [pattern] = argv._;
        const tree = argv['tree'] || false;
        return {
            pattern,
            tree,
        };
    }
}
exports.matchIndexStart = matchIndexStart;
//# sourceMappingURL=regex.js.map