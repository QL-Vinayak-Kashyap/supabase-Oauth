import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="container relative flex flex-col items-center justify-center space-y-10 py-32 text-center md:py-36 lg:py-40">
      <div className="space-y-8">
        <h1 className="hero-text mx-auto max-w-[1000px] animate-fade-up">
          Boost Your Blog
          <br />
          Traffic Today
        </h1>
        <p className="lead-text mx-auto animate-fade-up">
          Leverage Blogify's AI-driven SEO tools to enhance your blog's visibility and rank higher in search results.
          Transform your content strategy efficiently with the power of AI.
        </p>
      </div>
      <Link href='/dashboard'>
      <Button size="lg" className="animate-fade-up bg-white text-background hover:bg-white/90" >
        Get Started
      </Button>
      </Link>
    </section>
  )
}

