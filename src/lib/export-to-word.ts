import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ExternalHyperlink,
} from "docx";
import { marked } from "marked";

export const exportToWord = async (markdownContent: string, topic: string) => {
  const tokens = marked.lexer(markdownContent);
  const docChildren = [];
  let listLevel = 0;

  for (const token of tokens) {
    if (token.type === "heading") {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: token.text,
              bold: true,
              size: token.depth === 2 ? 36 : 30,
            }),
          ],
          heading:
            token.depth === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
          spacing: { after: 100 },
        })
      );
    } else if (token.type === "list") {
      listLevel++; // Increase list level

      token.items.forEach((item: any, index: number) => {
        const isOrdered = token.ordered;
        const prefix = isOrdered ? `${index + 1}. ` : "• ";
        const children = [new TextRun({ text: prefix, bold: true, size: 24 })]; // Bullet or Number prefix

        let parts = item.text.split(/\*\*(.*?)\*\*/);
        if (item.text.includes("- **")) {
          parts = item.tokens[0].text.split(/\*\*(.*?)\*\*/);
        }
        for (let i = 0; i < parts.length; i++) {
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

        // Handle nested lists properly
        if (item.tokens) {
          item.tokens.forEach((nestedToken: any) => {
            if (nestedToken.type === "list") {
              nestedToken.items.forEach(
                (nestedItem: any, nestedIndex: number) => {
                  const nestedPrefix = nestedToken.ordered
                    ? `${nestedIndex + 1}. `
                    : "   • ";

                  const nestedChildren = [
                    new TextRun({ text: nestedPrefix, bold: true, size: 22 }),
                  ];

                  const nestedParts = nestedItem.text.split(/\*\*(.*?)\*\*/);
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
      if (!token.text.includes("- **")) {
        const textRuns = parseMarkdownText(token.text);
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
        children: [
          new Paragraph({
            children: [new TextRun({ text: topic, bold: true, size: 56 })],
          }),
          ...docChildren,
        ],
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

function parseMarkdownText(text) {
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
  let match;
  const parts = [];
  let lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(new TextRun({ text: text.substring(lastIndex, match.index) }));
    }
    parts.push(
      new ExternalHyperlink({
        children: [new TextRun({ text: match[1], style: "Hyperlink" })],
        link: match[2],
      })
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(new TextRun({ text: text.substring(lastIndex) }));
  }

  return parts.length > 0 ? parts : [new TextRun({ text })];
}
