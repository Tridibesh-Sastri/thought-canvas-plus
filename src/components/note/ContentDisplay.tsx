
import { ContentItem } from "@/types";
import { useMemo } from "react";

interface ContentDisplayProps {
  content: ContentItem;
}

export function ContentDisplay({ content }: ContentDisplayProps) {
  const renderedContent = useMemo(() => {
    switch (content.type) {
      case "image":
        return (
          <div className="content-preview">
            <img 
              src={content.value} 
              alt="Uploaded image" 
              className="max-h-64 mx-auto rounded"
            />
          </div>
        );
      case "drawing":
        return (
          <div className="content-preview">
            <img 
              src={content.value} 
              alt="Drawing" 
              className="max-h-64 mx-auto rounded"
            />
          </div>
        );
      case "file":
        return (
          <div className="content-preview p-3 flex items-center gap-2 bg-muted/50">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-muted-foreground" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <span className="text-sm">{content.value}</span>
          </div>
        );
      case "link":
        return (
          <div className="content-preview p-3 flex items-center gap-2 bg-muted/50">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-muted-foreground" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" 
              />
            </svg>
            <a 
              href={content.value} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-blue-600 hover:underline"
            >
              {content.value}
            </a>
          </div>
        );
      default:
        return null;
    }
  }, [content]);

  return renderedContent;
}
