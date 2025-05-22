"use client";

import { useEffect } from "react";
import Navbar from "@/components/app/navbar";
import Hero from "@/components/app/hero";
import Features from "@/components/app/features";
import CallToAction from "@/components/app/CallToAction";
import Footer from "@/components/app/Footer";
import Process from "@/components/app/Process";
import Testimonials from "@/components/app/Testimonials";
import Faq from "@/components/app/FAQ";

export default function Home() {
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top:
              targetElement.getBoundingClientRect().top + window.scrollY - 100,
            behavior: "smooth",
          });
        }
      });
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener("click", function () {});
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Process />
        <Features />
        {/* <AgentNetwork /> */}
        <Faq />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer /> 
    </div>
  );
}
