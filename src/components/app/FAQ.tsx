import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does WriteEasy differ from other AI writing tools?",
    answer:
      "WriteEasy uses a specialized agent network where multiple AI experts collaborate on your content. Unlike single-model tools, our platform combines the strengths of different AI specialists focusing on writing quality, SEO optimization, fact-checking, and more to produce content that's more comprehensive, accurate, and engaging.",
  },
  {
    question: "Will the content pass AI detection tools?",
    answer:
      "Yes, our Humanization Agent specifically works to ensure content reads naturally and authentically human. We regularly test against popular AI detection tools and optimize our system to produce content that passes these checks while maintaining high quality and readability.",
  },
  {
    question: "Can I customize the tone and style of the content?",
    answer:
      "Absolutely! When creating your content brief, you can specify your preferred tone (professional, conversational, authoritative, etc.) and style. Our AI agents will tailor the content to match your brand voice and audience expectations.",
  },
  {
    question: "How does the SEO optimization work?",
    answer:
      "Our dedicated SEO Agent analyzes your target keywords and topic, then strategically incorporates them throughout the content in a natural, non-forced way. It also optimizes header structure, meta descriptions, and ensures proper keyword density to maximize search engine visibility without compromising readability.",
  },
  {
    question: "Can I edit the content after it's generated?",
    answer:
      "Yes, all generated content is fully editable. After receiving your content, you can make any adjustments, add personal insights, or modify sections as needed through our user-friendly editor before publishing or exporting it.",
  },
  {
    question: "What types of content can WriteEasy create?",
    answer:
      "WriteEasy can create a wide range of content including blog posts, articles, product descriptions, social media posts, newsletters, and more. The platform is versatile enough to handle various content formats and topics across different industries.",
  },
];

const Faq = () => {
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <div className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 mb-4">
            Questions & Answers
          </div>
          <h2 className="heading-lg mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about our AI content creation
            platform.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion
            type="single"
            collapsible
            className="bg-white rounded-lg shadow-sm"
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-gray-200 last:border-b-0"
              >
                <AccordionTrigger className="py-5 px-6 hover:no-underline hover:bg-gray-50 text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 pt-0 text-gray-600">
                  {faq.answer}
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
