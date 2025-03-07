"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter, SyntaxHighlighterProps } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"
import remarkGfm from "remark-gfm"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="mb-4 text-2xl font-bold" {...props} />,
          h2: ({ node, ...props }) => <h2 className="mb-3 mt-6 text-xl font-semibold" {...props} />,
          h3: ({ node, ...props }) => <h3 className="mb-3 mt-5 text-lg font-semibold" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4 leading-7" {...props} />,
          ul: ({ node, ...props }) => <ul className="mb-4 ml-6 list-disc" {...props} />,
          ol: ({ node, ...props }) => <ol className="mb-4 ml-6 list-decimal" {...props} />,
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          a: ({ node, ...props }) => (
            <a className="text-primary underline underline-offset-4 hover:text-primary/80" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-muted-foreground/20 pl-4 italic" {...props} />
          ),
          //@ts-ignore
          code({ inline, className = "", children, ...props }) {
            const match = /language-(\w+)/.exec(className)
            return !inline && match ? (
              <SyntaxHighlighter
                //@ts-ignore
                style={vscDarkPlus as Readonly<SyntaxHighlighterProps>}
                language={match[1]}
                PreTag="div"
                className="rounded-md border"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm" {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
