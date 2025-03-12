import { diffLines } from "diff";

export function highlightDifferencesMarkdown(
  original: string,
  updated: string
) {
  const diff = diffLines(original, updated);
  let markdownText = "";

  diff.forEach((part) => {
    if (part.added) {
      // Added text (Green highlight in Markdown)
      markdownText += `**+ ${part.value.trim()}**\n`;
    } else if (part.removed) {
      // Removed text (Strikethrough in Markdown)
      markdownText += `~~- ${part.value.trim()}~~\n`;
    } else {
      // Unchanged text
      markdownText += `${part.value.trim()}\n`;
    }
  });

  return markdownText.trim();
}
