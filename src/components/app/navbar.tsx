"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setScrollPosition(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClasses = `fixed w-full py-6 px-4 md:px-8 lg:px-16 transition-all duration-300 z-50
  ${scrollPosition > 50 ? "backdrop-blur-md bg-white/70 shadow-sm" : "bg-transparent"}`;

  return (
    // <header
    //   className={cn(
    //     "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 shadow-sm",
    //     scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
    //   )}
    // >
    //   <div className="container flex items-center justify-between">
    //     <Link href="/" className="flex items-center space-x-2">
    //       <span className="text-2xl font-bold text-grey-600">WriteEasy</span>
    //     </Link>

    //     {/* <nav className="hidden md:flex items-center space-x-1">
    //       <a href="#features" className="nav-link">
    //         Features
    //       </a>
    //       <a href="#testimonials" className="nav-link">
    //         Testimonials
    //       </a>
    //       <a href="#pricing" className="nav-link">
    //         Pricing
    //       </a>
    //       <a href="#contact" className="nav-link">
    //         Contact
    //       </a>
    //     </nav> */}

    //     <div className="flex items-center space-x-4">
    //       <Link
    //         href="/login"
    //         className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
    //       >
    //         Log In
    //       </Link>
    //     </div>
    //   </div>
    // </header>
    <>
    <header className={headerClasses}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/writeeasy.png" 
              alt="WriteEasy Logo" 
              className="h-8 w-8 mr-2"  
            />
            <h1 className="text-2xl font-bold tracking-tighter">
              Write<span className="font-extrabold">Easy</span>
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8 items-center">
            <a href="#how-it-works" className="text-sm font-medium hover:text-gray-600 transition-colors">
              How It Works
            </a>
            <a href="#features" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Why WriteEasy
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Success Stories
            </a>
            <Link
            href="/login"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Start Writing Now
          </Link>
          </nav>
          <Button className="md:hidden glossy-button rounded-md px-4 py-2 text-sm">
            Menu
          </Button>
        </div>
      </div>
    </header>
    {/* Placeholder div to prevent content from jumping when header becomes fixed */}
    <div className="py-6 px-4 md:px-8 lg:px-16 invisible">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  </>
  );
};

export default Navbar;
