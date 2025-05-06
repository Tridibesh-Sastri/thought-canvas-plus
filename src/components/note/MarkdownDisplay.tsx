
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownDisplayProps {
  content: string;
  className?: string;
}

export function MarkdownDisplay({ content, className }: MarkdownDisplayProps) {
  // Memoize the markdown rendering to avoid unnecessary re-renders
  const renderedMarkdown = useMemo(() => {
    return (
      <div className={cn("markdown-content", className)}>
        <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
          {content}
        </ReactMarkdown>
      </div>
    );
  }, [content, className]);
  
  return renderedMarkdown;
}
