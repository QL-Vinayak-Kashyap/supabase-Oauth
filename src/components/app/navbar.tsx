"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 shadow-sm",
        scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-purple-600">WriteEasy</span>
        </Link>

        {/* <nav className="hidden md:flex items-center space-x-1">
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#testimonials" className="nav-link">
            Testimonials
          </a>
          <a href="#pricing" className="nav-link">
            Pricing
          </a>
          <a href="#contact" className="nav-link">
            Contact
          </a>
        </nav> */}

        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Log In
          </Link>
          {/* <Link href="#" className="button-primary">
            Get Started
          </Link> */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
