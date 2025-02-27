"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { useToast } from "@/components/ui/use-toast"

interface GeneratedContent {
  content: string
  wordCount: number
}

export function ContentGenerator() {
  const [topic, setTopic] = React.useState("")
  const [wordCount, setWordCount] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [generatedContent, setGeneratedContent] = React.useState<GeneratedContent | null>(null)
  // const { toast } = useToast()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Replace this with your actual API call
      const response = await new Promise<GeneratedContent>((resolve) =>
        setTimeout(() => {
          resolve({
            content: `Here is a sample generated content about "${topic}" with approximately ${wordCount} words. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
            wordCount: Number.parseInt(wordCount),
          })
        }, 2000),
      )

      setGeneratedContent(response)
    } catch (error) {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: "Failed to generate content. Please try again.",
      // })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generation Parameters</CardTitle>
            <CardDescription>Enter the details for your content generation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="Enter your topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wordCount">Number of Words</Label>
              <Input
                id="wordCount"
                type="number"
                placeholder="Enter desired word count"
                value={wordCount}
                onChange={(e) => setWordCount(e.target.value)}
                min="50"
                max="2000"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Generating..." : "Generate Content"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>
              Generated {generatedContent.wordCount} words about &quot;{topic}&quot;
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-muted p-4">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {generatedContent.content.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(generatedContent.content)
                toast({
                  title: "Copied!",
                  description: "Content copied to clipboard.",
                })
              }}
            >
              Copy to Clipboard
            </Button>
            <Button variant="outline" onClick={() => setGeneratedContent(null)}>
              Clear
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

