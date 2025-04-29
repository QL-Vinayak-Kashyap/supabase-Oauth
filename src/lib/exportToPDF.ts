import { marked } from "marked";
import html2pdf from "html2pdf.js";
import { toast } from "sonner";

export const handleExportPDF = async(forWord,topicName) => {
    const element = document.createElement('div');

    element.setAttribute('style', `
      padding: 1rem;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #000;
    `);
  
    // Apply break-avoid CSS rules
    element.innerHTML = ` <style>  * {
        page-break-inside: avoid;
      }
      h1 {
        font-size: 24px;
        margin-bottom: 12px;
        font-weight: bold;
      }
      h2 {
        font-size: 20px;
        margin-top: 24px;
        margin-bottom: 12px;
        font-weight: bold;
      }
      h3 {
        font-size: 16px;
        margin-top: 20px;
        margin-bottom: 10px;
        font-weight: bold;
      }
      p {
        margin: 12px 0;
      }
      ul, ol {
        padding-left: 20px;
        margin: 12px 0;
      }
      li {
        margin-bottom: 6px;
      }
      strong {
        font-weight: bold;
      }
      em {
        font-style: italic;
      }
      code {
        font-family: monospace;
        background: #f4f4f4;
        padding: 2px 4px;
        border-radius: 4px;
      }
    </style> ${marked(forWord)}`;

    const opt = {
      margin: 1,
      filename: `${topicName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      await html2pdf().from(element).set(opt).save();
      toast("Your content has been exported as PDF successfully.");
    } catch (error) {
      toast("Failed to generate PDF. Please try again.");
    }
  }