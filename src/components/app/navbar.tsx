import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="logo flex items-center space-x-2">
          <span className="text-xl font-bold">Blogify</span>
        </Link>
        {/* <nav className="flex items-center gap-4">
          <Button variant="outline" className="text-sm font-medium">
            
          </Button> 
        </nav> */}
      </div>
    </header>
  )
}

