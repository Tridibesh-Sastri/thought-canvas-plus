
import { ChecklistItem, ContentItem } from "@/types";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotebooks } from "@/contexts/NotebooksContext";

interface ContentDisplayProps {
  content: ContentItem;
  noteId: string;
  lineId: string;
}

export function ContentDisplay({ content, noteId, lineId }: ContentDisplayProps) {
  const { updateChecklistItem } = useNotebooks();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getContentTypeName = () => {
    switch (content.type) {
      case "image":
        return "Image";
      case "drawing":
        return "Drawing";
      case "file":
        return "File: " + content.value;
      case "link":
        return "Link: " + content.value;
      case "checklist":
        return "Checklist";
      default:
        return "Content";
    }
  };

  const handleCheckboxChange = (item: ChecklistItem, checked: boolean) => {
    if (updateChecklistItem) {
      updateChecklistItem(noteId, lineId, item.id, { ...item, checked });
    }
  };

  const renderedContent = useMemo(() => {
    switch (content.type) {
      case "image":
        return (
          <div className={cn("content-preview", !isExpanded && "hidden")}>
            <img 
              src={content.value} 
              alt="Uploaded image" 
              className="max-h-64 mx-auto rounded"
            />
          </div>
        );
      case "drawing":
        return (
          <div className={cn("content-preview", !isExpanded && "hidden")}>
            <img 
              src={content.value} 
              alt="Drawing" 
              className="max-h-64 mx-auto rounded"
            />
          </div>
        );
      case "file":
        return (
          <div className={cn("content-preview p-3 flex items-center gap-2 bg-muted/50", !isExpanded && "hidden")}>
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
          <div className={cn("content-preview p-3 flex items-center gap-2 bg-muted/50", !isExpanded && "hidden")}>
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
      case "checklist":
        return (
          <div className={cn("content-preview p-3", !isExpanded && "hidden")}>
            <div className="space-y-2">
              {content.checklistItems?.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox 
                    id={item.id} 
                    checked={item.checked}
                    onCheckedChange={(checked) => handleCheckboxChange(item, checked === true)}
                  />
                  <label 
                    htmlFor={item.id} 
                    className={cn(
                      "text-sm",
                      item.checked && "line-through text-muted-foreground"
                    )}
                  >
                    {item.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [content, isExpanded, handleCheckboxChange]);

  return (
    <div className="mt-1 ml-1">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleExpand} 
        className="h-6 text-xs px-2 flex items-center gap-1 bg-muted/50 hover:bg-muted"
      >
        {getContentTypeName()}
        {isExpanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </Button>
      {renderedContent}
    </div>
  );
}
