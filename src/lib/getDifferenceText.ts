import { diffLines } from "diff";

export function highlightDifferencesMarkdown(original, updated) {
  let diff = diffLines(original, updated);
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

// // Example Usage
// const originalText = "This is an example text.\nIt has multiple lines.\nThis line will be removed.";
// const updatedText = "This is an example text.\nIt has multiple lines.\nThis line has been changed.";

// console.log(highlightDifferencesMarkdown(originalText, updatedText));
