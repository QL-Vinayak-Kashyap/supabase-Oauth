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

  return (<>
    <header className={headerClasses}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
          <img
              src="/writeeasy.png"
              alt="WriteEasy Logo"
              className="h-10 w-10 mr-2"
            />
            <h1 className="text-2xl font-normal tracking-tighter">
              Write<span className="font-bold">Easy</span>
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
              href="/auth/login"
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
