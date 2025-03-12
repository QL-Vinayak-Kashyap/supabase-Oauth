import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { marked } from "marked";

export const exportToWord = async (markdownContent: string, topic: string) => {
  const tokens = marked.lexer(markdownContent); // Tokenize Markdown

  const docChildren = [];
  let listLevel = 0;

  // Loop through parsed Markdown tokens and convert them to Word elements
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

      token.items.forEach((item: any) => {
        // Check for **bold** text in list items
        const boldMatches = item.text.match(/\*\*(.*?)\*\*/g);
        const children = [];

        if (boldMatches) {
          // Convert **bold** parts to TextRun with bold styling
          const parts = item.text.split(/\*\*(.*?)\*\*/);
          for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 1) {
              children.push(
                new TextRun({
                  text: parts[i],
                  bold: true,
                  size: 24 + listLevel * 2,
                })
              );
            } else {
              children.push(
                new TextRun({ text: parts[i], size: 24 + listLevel * 2 })
              );
            }
          }
        } else {
          // No bold text, add as normal text
          children.push(
            new TextRun({ text: item.text, size: 24 + listLevel * 2 })
          );
        }

        docChildren.push(
          new Paragraph({
            children,
            spacing: { after: 100 },
            indent: { left: listLevel * 720, hanging: 360 }, // Adding left indentation for list items
          })
        );
      });

      listLevel--;
    } else if (token.type === "paragraph") {
      docChildren.push(
        new Paragraph({
          children: [new TextRun({ text: token.text, size: 28 })],
          spacing: { after: 100 },
        })
      );
    }
  }

  // Create the Word document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            children: [new TextRun({ text: topic, bold: true, size: 56 })],
          }),
          ...docChildren, // Add processed Markdown elements
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
