import { FileText, Edit, CheckCircle } from "lucide-react";

const Process = () => {
  return (
    <section id="process" className="py-20 relative overflow-hidden bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <div className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 mb-4">
            Simple Process
          </div>
          <h2 className="heading-lg mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Create professional, engaging content in just three simple steps
            with our AI-powered platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center mb-6">
              <FileText className="h-10 w-10 text-purple-700" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Inputs</h3>
            <p className="text-muted-foreground">
              Enter your topic, keywords, and any specific requirements for your
              content.
            </p>
          </div>

          <div className="flex flex-col items-center text-center relative">
            <div className="absolute left-0 top-10 w-full h-0.5 bg-purple-100 hidden md:block -z-10"></div>
            <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center mb-6">
              <Edit className="h-10 w-10 text-purple-700" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Agents</h3>
            <p className="text-muted-foreground">
              Our specialized AI agents work together to draft, review, and
              optimize your content.
            </p>
          </div>

          <div className="flex flex-col items-center text-center relative">
            <div className="absolute left-0 top-10 w-full h-0.5 bg-purple-100 hidden md:block -z-10"></div>
            <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-purple-700" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Preview</h3>
            <p className="text-muted-foreground">
              Receive your finished content, make any final adjustments
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
