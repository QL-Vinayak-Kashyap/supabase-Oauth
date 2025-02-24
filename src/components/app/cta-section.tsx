import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="container py-24 sm:py-32">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Boost Your Blog's Visibility</h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Unlock the power of AI to enhance your content strategy. Let Blogify optimize your SEO efforts for better
          ranking and increased traffic from New Delhi and beyond.
        </p>
        <Button className="mt-4" size="lg">
          Start Now
        </Button>
      </div>
    </section>
  )
}

