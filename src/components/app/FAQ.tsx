import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { HelpCircle } from "lucide-react";

const faqItems = [
  {
    question: "How does WriteEasy differ from other AI writing tools?",
    answer: "WriteEasy uses a team of specialized AI agents for writing, SEO optimization, human-like tone, and legal checks — delivering content that's not only well-written but also SEO-ready and compliant."
  },
  {
    question: "Will the content pass AI detection tools?",
    answer: "Yes, WriteEasy includes a Humanization Agent that transforms generated content to mimic human writing style, helping it pass most AI detection tools."
  },
  {
    question: "Can I customize the tone and style of the content?",
    answer: "Absolutely. You can input your preferred tone, style, and keywords, and edit the outline before the AI begins writing."
  },
  {
    question: "How does the SEO optimization work?",
    answer: "An SEO Agent integrates primary and secondary keywords naturally into your content, improving chances of ranking higher on search engines."
  },
  {
    question: "Can I edit the content after it's generated?",
    answer: "Yes, you can review, modify, and fine-tune the content before finalizing or publishing it."
  },
  {
    question: "What types of content can WriteEasy create?",
    answer: "WriteEasy is optimized for blog posts, but can also handle guides, thought leadership articles, SEO content, and more."
  }
];

const Faq = () => {
  return (
    <section id="faq" className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-white">
    <div className="container mx-auto">
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center mb-4 bg-gray-100 p-3 rounded-full">
          <HelpCircle className="h-8 w-8 text-gray-700" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get answers to common questions about WriteEasy
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto animate-fade-up">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
              <AccordionTrigger className="py-6 text-left font-semibold text-lg hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6 text-base">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
  );
};

export default Faq;
