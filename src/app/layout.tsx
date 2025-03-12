import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReduxProvider } from "@/redux/provider";

export const metadata = {
  title: "Blogify - Boost Your Blog Traffic Today",
  description:
    "Leverage Blogify's AI-driven SEO tools to enhance your blog's visibility and rank higher in search results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
          </TooltipProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
