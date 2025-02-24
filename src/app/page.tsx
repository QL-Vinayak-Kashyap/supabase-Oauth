import { Hero } from "@/components/app/hero";
import { Navbar } from "@/components/app/navbar";
import {Features} from "@/components/app/features";
import { ContactForm } from "@/components/app/contact-form";
import { CTASection } from "@/components/app/cta-section";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <Features/>
      <CTASection/>
      <ContactForm/>
    </main>
  );
}