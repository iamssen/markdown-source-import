export function escapeMarkdownSpecialCharacters(text: string): string {
  return text.replace(/([_*\\-])/ig, '\\$1');
}