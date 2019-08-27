import { escapeMarkdownSpecialCharacters } from './escapeMarkdownSpecialCharacters';

export function createTitle(text: string, titleTag: string): string {
  switch (titleTag) {
    case 'h1':
      return '# ' + escapeMarkdownSpecialCharacters(text);
    case 'h2':
      return '## ' + escapeMarkdownSpecialCharacters(text);
    case 'h3':
      return '### ' + escapeMarkdownSpecialCharacters(text);
    case 'h4':
      return '#### ' + escapeMarkdownSpecialCharacters(text);
    case 'h5':
      return '##### ' + escapeMarkdownSpecialCharacters(text);
    default:
      return `<${titleTag}><code>${text}</code></${titleTag}>`;
  }
}