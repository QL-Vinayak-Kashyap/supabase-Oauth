import {
  Zap,
  BarChart3,
  Search,
  LineChart,
  RefreshCw,
  Award,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

const FeatureCard = ({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
  return (
    <div
      className="glass-card rounded-xl p-6 opacity-0"
      style={{
        animation: `fade-in-up 0.5s ease-out ${0.1 + index * 0.1}s forwards`,
      }}
    >
      <div
        className={cn(
          "rounded-full w-12 h-12 flex items-center justify-center mb-4",
          feature.color
        )}
      >
        <feature.icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      <p className="text-muted-foreground">{feature.description}</p>
    </div>
  );
};

const Features = () => {
  return (
    // <section id="features" className="py-20 md:py-32 relative overflow-hidden">
    //   {/* Background Elements */}
    //   <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-grey-100/50 blur-3xl -z-10"></div>

    //   <div className="container">
    //     <div className="text-center max-w-2xl mx-auto mb-16">
    //       <div className="inline-block rounded-full bg-grey-100 px-3 py-1 text-sm font-medium text-grey-700 mb-4 animate-fade-in">
    //         Advanced Tools
    //       </div>
    //       <h2
    //         className="heading-lg mb-4 animate-fade-in"
    //         style={{ animationDelay: "0.1s" }}
    //       >
    //         Top Reasons{" "}
    //         <span className="text-grey-600">for best Content Creator</span>
    //       </h2>
    //       <p
    //         className="text-lg text-muted-foreground animate-fade-in"
    //         style={{ animationDelay: "0.2s" }}
    //       >
    //         Everything you need to optimize your blog's content and skyrocket
    //         your traffic with data-driven strategies.
    //       </p>
    //     </div>

    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //       {features.map((feature, index) => (
    //         <FeatureCard key={feature.title} feature={feature} index={index} />
    //       ))}
    //     </div>
    //   </div>
    // </section>
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
