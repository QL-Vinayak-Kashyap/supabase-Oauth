"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
// import ParticlesBackground from "./ParticlesBackground";

const Hero = () => {
  return (
    <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            AI-Written Blogs That <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 italic inline-block w-full">Rank Better</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-700">
            Human-quality content with SEO optimization in minutes, <br className="hidden md:block" /> 
            not hours. No more writer's block.
          </p>
          <div className="flex justify-center">
            <Button className="glossy-button rounded-md px-8 py-6 text-lg font-medium">
              Generate Your First Blog
            </Button>
          </div>
        </div>
      </div>
    </section>
    // <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
    //   <div className="container">
    //     <div className="mx-auto max-w-4xl text-center">
    //       <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground mb-8 stagger-animate-1">
    //         <span className="flex h-2 w-2 rounded-full bg-grey-500 mr-2"></span>
    //         Introducing WriteEasy SEO Tools
    //       </div>
    //       <h1 className="heading-xl mb-6 text-balance stagger-animate-2">
    //         Boost Your Blog Traffic with <br className="hidden sm:inline" />
    //         <span className="text-glow text-primary">SEO Strategies</span>
    //       </h1>
    //       <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10 text-balance stagger-animate-3">
    //         Leverage WriteEasy's AI-driven SEO tools to enhance your blog's
    //         visibility and rank higher in search results. Transform your content
    //         strategy efficiently with the power of AI.
    //       </p>
    //       <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 stagger-animate-4">
    //         <Link href="/dashboard" className="button-primary w-full sm:w-auto">
    //           Get Started
    //           <ArrowRight className="ml-2 h-4 w-4" />
    //         </Link>
    //         {/* <Link  href="#" className="button-secondary w-full sm:w-auto">
    //           View Demo
    //         </Link> */}
    //       </div>
    //     </div>

    //     {/* Dashboard Preview */}
    //     {/* <div
    //       className="mt-16 md:mt-24 animate-fade-in-up opacity-0"
    //       style={{ animationDelay: "0.5s" }}
    //     >
    //       <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
    //         <div className="grey-gradient h-1.5 w-full"></div>
    //         <div className="p-2 bg-white/90">
    //           <div className="rounded-lg overflow-hidden border border-slate-200/70">
    //             <div className="aspect-[16/9] w-full bg-slate-50 rounded-t-lg"></div>
    //           </div>
    //         </div>
    //       </div>
    //     </div> */}
    //   </div>
    // </section>
  );
};

export default Hero;
