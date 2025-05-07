
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
        {/* The newer version of react-markdown doesn't accept className directly */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    );
  }, [content, className]);
  
  return renderedMarkdown;
}
