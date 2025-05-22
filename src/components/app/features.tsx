import {
  Check,
} from "lucide-react";

const features = [
  {
    title: 'Multiple AI Agents',
    description: 'Each focused on different aspects of SEO optimization for comprehensive coverage'
  },
  {
    title: 'Natural Keyword Integration',
    description: 'Seamlessly integrates primary and secondary keywords in a natural, readable way'
  },
  {
    title: 'Human-Like Content',
    description: 'Writing that reads like it was crafted by an expert human writer, not an AI'
  },
  {
    title: 'Fact-Checked Information',
    description: 'All content is verified against reliable sources for accuracy'
  },
  {
    title: 'SEO Performance',
    description: 'Content that passes all major SEO scoring metrics and ranking factors'
  },
  {
    title: 'Deep Web Research',
    description: 'Thorough research capabilities to ensure content is accurate and relevant'
  },
  {
    title: 'Customizable Length',
    description: 'Adjust word count to match your specific content needs'
  },
  {
    title: 'Style Customization',
    description: 'Choose between formal, conversational, witty, or informative tones'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-black text-white">
    <div className="container mx-auto">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why WriteEasy is a Winner</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Everything you need to create high-performing blog content
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="p-6 rounded-lg border border-gray-800 hover:border-gray-600 transition-all duration-300 animate-fade-up group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start mb-4">
              <div className="bg-white rounded-full p-1 mr-3 group-hover:bg-gray-300 group-hover:scale-110 transition-all duration-300">
                <Check className="h-4 w-4 text-black" />
              </div>
              <h3 className="text-lg font-bold">{feature.title}</h3>
            </div>
            <p className="text-gray-400 ml-8 group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default Features;
