"use client";

import Link from "next/link";

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
            <Link href="/dashboard" className="glossy-button px-8 py-3 text-lg font-medium rounded-lg">Generate Your First Blog</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
