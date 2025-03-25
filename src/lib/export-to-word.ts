import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ExternalHyperlink,
} from "docx";
import { marked } from "marked";

// Define types for tokens
interface MarkdownToken {
  type: string;
  text?: string;
  depth?: number;
  ordered?: boolean;
  items?: MarkdownListItem[];
  tokens?: MarkdownToken[];
}

interface MarkdownListItem {
  text: string;
  tokens?: MarkdownToken[];
}

export const exportToWord = async (markdownContent: string, topic: string) => {
  const tokens: MarkdownToken[] = marked.lexer(
    markdownContent
  ) as MarkdownToken[];
  const docChildren: Paragraph[] = [];
  let listLevel = 0;

  for (const token of tokens) {
    if (token.type === "heading") {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: token.text || "",
              bold: true,
              size: token.depth === 2 ? 36 : 30,
            }),
          ],
          heading:
            token.depth === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
          spacing: { after: 100 },
        })
      );
    } else if (token.type === "list" && token.items) {
      listLevel++; // Increase list level

      token.items.forEach((item: MarkdownListItem, index: number) => {
        const isOrdered = token.ordered;
        const prefix = isOrdered ? `${index + 1}. ` : "• ";
        const children: TextRun[] = [
          new TextRun({ text: prefix, bold: true, size: 24 }),
        ];

        let parts = item.text?.split(/\*\*(.*?)\*\*/);
        if (item.text?.includes("- **")) {
          parts = item.tokens?.[0]?.text?.split(/\*\*(.*?)\*\*/) || [];
        }
        for (let i = 0; i < parts?.length; i++) {
          if (i % 2 === 1) {
            children.push(
              new TextRun({ text: parts[i], bold: true, size: 24 })
            );
          } else {
            children.push(new TextRun({ text: parts[i], size: 24 }));
          }
        }

        docChildren.push(
          new Paragraph({
            children,
            spacing: { after: 100 },
            indent: { left: listLevel * 720, hanging: 360 }, // Indentation for nested lists
          })
        );

        // Handle nested lists
        if (item?.tokens) {
          item?.tokens.forEach((nestedToken: MarkdownToken) => {
            if (nestedToken?.type === "list" && nestedToken.items) {
              nestedToken.items.forEach(
                (nestedItem: MarkdownListItem, nestedIndex: number) => {
                  const nestedPrefix = nestedToken?.ordered
                    ? `${nestedIndex + 1}. `
                    : "   • ";

                  const nestedChildren: TextRun[] = [
                    new TextRun({ text: nestedPrefix, bold: true, size: 22 }),
                  ];

                  const nestedParts =
                    nestedItem.text?.split(/\*\*(.*?)\*\*/) || [];
                  for (let j = 0; j < nestedParts.length; j++) {
                    if (j % 2 === 1) {
                      nestedChildren.push(
                        new TextRun({
                          text: nestedParts[j],
                          bold: true,
                          size: 22,
                        })
                      );
                    } else {
                      nestedChildren.push(
                        new TextRun({ text: nestedParts[j], size: 22 })
                      );
                    }
                  }

                  docChildren.push(
                    new Paragraph({
                      children: nestedChildren,
                      spacing: { after: 80 },
                      indent: { left: (listLevel + 1) * 720, hanging: 360 }, // Further indentation
                    })
                  );
                }
              );
            }
          });
        }
      });

      listLevel--; // Decrease after list ends
    } else if (token.type === "paragraph") {
      if (!token.text?.includes("- **")) {
        const textRuns = parseMarkdownText(token.text || "");
        docChildren.push(
          new Paragraph({
            children: textRuns,
            spacing: { after: 100 },
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [...docChildren],
      },
    ],
  });

  // Generate and download the Word file
  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${topic}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// Function to parse markdown links

function parseMarkdownText(text: string) {
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
  let match = regex.exec(text);
  const parts = [];
  let lastIndex = 0;

  while (match !== null) {
    if (match?.index > lastIndex) {
      parts.push(new TextRun({ text: text.substring(lastIndex, match.index) }));
    }
    parts.push(
      new ExternalHyperlink({
        children: [new TextRun({ text: match[1], style: "Hyperlink" })],
        link: match[2],
      })
    );
    lastIndex = regex.lastIndex;
    match = regex.exec(text);
  }

  if (lastIndex < text.length) {
    parts.push(new TextRun({ text: text.substring(lastIndex) }));
  }

  return parts.length > 0 ? parts : [new TextRun({ text })];
}
