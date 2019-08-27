"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const escapeMarkdownSpecialCharacters_1 = require("./escapeMarkdownSpecialCharacters");
function createTitle(text, titleTag) {
    switch (titleTag) {
        case 'h1':
            return '# ' + escapeMarkdownSpecialCharacters_1.escapeMarkdownSpecialCharacters(text);
        case 'h2':
            return '## ' + escapeMarkdownSpecialCharacters_1.escapeMarkdownSpecialCharacters(text);
        case 'h3':
            return '### ' + escapeMarkdownSpecialCharacters_1.escapeMarkdownSpecialCharacters(text);
        case 'h4':
            return '#### ' + escapeMarkdownSpecialCharacters_1.escapeMarkdownSpecialCharacters(text);
        case 'h5':
            return '##### ' + escapeMarkdownSpecialCharacters_1.escapeMarkdownSpecialCharacters(text);
        default:
            return `<${titleTag}><code>${text}</code></${titleTag}>`;
    }
}
exports.createTitle = createTitle;
//# sourceMappingURL=createTitle.js.map