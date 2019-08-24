"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
exports.startPattern = /^<!--\s*import ((\.\.\/|[a-zA-Z0-9._/\\,!?*(|){}\[\]\-])*\.[a-zA-Z0-9,!?*(|){}\[\]\-]+\s*[\-a-z0-9: ]*)-->\s*$/;
exports.endPattern = /^<!--\s*importend\s*-->\s*$/;
exports.slicePattern = /([0-9]+):([0-9]+)/;
const options = {
    boolean: ['hide-filename'],
};
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
function match(line) {
    const matched = line.match(exports.startPattern);
    if (matched) {
        const argv = minimist_1.default(matched[1].trim().split(' '), options);
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
exports.match = match;
//# sourceMappingURL=regex.js.map