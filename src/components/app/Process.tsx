import { FileText, Edit, CheckCircle, Check } from "lucide-react";

const Process = () => {
  const steps = [
    {
      title: 'Input your blog topic',
      description: 'Enter your primary subject or title idea. Our AI understands context and intentions.',
      icon: <FileText className="h-8 w-8" />,
      delay: '0ms'
    },
    {
      title: 'Add tone & keywords',
      description: 'Choose your writing style, add SEO keywords & review the outline.',
      icon: <Edit className="h-8 w-8" />,
      delay: '200ms'
    },
    {
      title: 'Review & Publish',
      description: 'Get your complete, SEO-optimized blog post ready to publish on your platform.',
      icon: <Check className="h-8 w-8" />,
      delay: '400ms'
    }
  ];
  return (
    // <section id="process" className="py-20 relative overflow-hidden bg-white">
    //   <div className="container">
    //     <div className="text-center mb-16">
    //       <div className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 mb-4">
    //         Simple Process
    //       </div>
    //       <h2 className="heading-lg mb-4">How It Works</h2>
    //       <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
    //         Create professional, engaging content in just three simple steps
    //         with our AI-powered platform.
    //       </p>
    //     </div>

    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
    //       <div className="flex flex-col items-center text-center">
    //         <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center mb-6">
    //           <FileText className="h-10 w-10 text-purple-700" />
    //         </div>
    //         <h3 className="text-xl font-semibold mb-3">Inputs</h3>
    //         <p className="text-muted-foreground">
    //           Enter your topic, keywords, and any specific requirements for your
    //           content.
    //         </p>
    //       </div>

    //       <div className="flex flex-col items-center text-center relative">
    //         <div className="absolute left-0 top-10 w-full h-0.5 bg-purple-100 hidden md:block -z-10"></div>
    //         <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center mb-6">
    //           <Edit className="h-10 w-10 text-purple-700" />
    //         </div>
    //         <h3 className="text-xl font-semibold mb-3">AI Agents</h3>
    //         <p className="text-muted-foreground">
    //           Our specialized AI agents work together to draft, review, and
    //           optimize your content.
    //         </p>
    //       </div>

    //       <div className="flex flex-col items-center text-center relative">
    //         <div className="absolute left-0 top-10 w-full h-0.5 bg-purple-100 hidden md:block -z-10"></div>
    //         <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center mb-6">
    //           <CheckCircle className="h-10 w-10 text-purple-700" />
    //         </div>
    //         <h3 className="text-xl font-semibold mb-3">Preview</h3>
    //         <p className="text-muted-foreground">
    //           Receive your finished content, make any final adjustments
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </section>
    <section id="how-it-works" className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How WriteEasy Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to create engaging, SEO-optimized blog content
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm step-card flex flex-col items-center text-center animate-fade-up"
              style={{ animationDelay: step.delay }}
            >
              <div className="bg-gray-100 p-4 rounded-full mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              <div className="mt-4 text-2xl font-bold">{index + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
