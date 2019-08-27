"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const escapeMarkdownSpecialCharacters_1 = require("./escapeMarkdownSpecialCharacters");
function createTitle(text, titleTag) {
    const titleText = escapeMarkdownSpecialCharacters_1.escapeMarkdownSpecialCharacters(text);
    switch (titleTag) {
        case 'h1':
            return '# ' + titleText;
        case 'h2':
            return '## ' + titleText;
        case 'h3':
            return '### ' + titleText;
        case 'h4':
            return '#### ' + titleText;
        case 'h5':
            return '##### ' + titleText;
        default:
            return `<${titleTag}><code>${titleText}</code></${titleTag}>`;
    }
}
exports.createTitle = createTitle;
//# sourceMappingURL=createTitle.js.map