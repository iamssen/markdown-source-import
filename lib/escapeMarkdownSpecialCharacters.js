"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function escapeMarkdownSpecialCharacters(text) {
    return text.replace(/([_*\\-])/ig, '\\$1');
}
exports.escapeMarkdownSpecialCharacters = escapeMarkdownSpecialCharacters;
//# sourceMappingURL=escapeMarkdownSpecialCharacters.js.map