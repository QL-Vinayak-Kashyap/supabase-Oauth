import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const CallToAction = () => {
  return (
    <section className="py-20 md:py-28 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Outstanding Blog Content?
          </h2>
          <p className="text-xl mb-10 text-gray-700 max-w-2xl mx-auto">
            Join thousands of content creators who save time and increase traffic with WriteEasy's AI-powered blog writing.
          </p>
          <Button className="glossy-button rounded-md px-8 py-6 text-lg font-medium">
            Start Writing Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
