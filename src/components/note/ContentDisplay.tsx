
import { ContentItem } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNotebooks } from "@/contexts/NotebooksContext";
import { FloatingWindow } from "@/components/ui/floating-window";
import { FloatingWindowContent } from "./content/FloatingWindowContent";
import { InlineContent } from "./content/InlineContent";
import { getContentTypeName } from "./content/ContentTypeUtils";

interface ContentDisplayProps {
  content: ContentItem;
  noteId: string;
  lineId: string;
}

export function ContentDisplay({ content, noteId, lineId }: ContentDisplayProps) {
  const { updateChecklistItem } = useNotebooks();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFloatingWindowOpen, setIsFloatingWindowOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleExpand = () => {
    if (!isFloatingWindowOpen) {
      setIsExpanded(!isExpanded);
    }
  };

  const openFloatingWindow = () => {
    setIsFloatingWindowOpen(true);
    setIsMinimized(false);
    setIsExpanded(false);
  };

  const closeFloatingWindow = () => {
    setIsFloatingWindowOpen(false);
    setIsMinimized(false);
  };

  const minimizeWindow = () => {
    setIsMinimized(!isMinimized);
  };

  // Handler for top-level checklist items
  const handleCheckboxChange = (item: any, checked: boolean) => {
    if (updateChecklistItem) {
      updateChecklistItem(noteId, lineId, null, item.id, { ...item, checked });
    }
  };

  // Handler for nested checklist items
  const handleNestedCheckboxChange = (parentId: string, item: any, checked: boolean) => {
    if (updateChecklistItem) {
      updateChecklistItem(noteId, lineId, parentId, item.id, { ...item, checked });
    }
  };

  return (
    <div className="mt-1 ml-1">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={openFloatingWindow} 
        className="h-6 text-xs px-2 flex items-center gap-1 bg-muted/50 hover:bg-muted"
      >
        {getContentTypeName(content.type, content.value)}
        <ChevronDown className="h-3 w-3" />
      </Button>

      {/* Toggle button for inline view */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleExpand}
        className="h-6 text-xs px-2 ml-1 flex items-center gap-1 bg-muted/50 hover:bg-muted"
      >
        {isExpanded ? "Hide" : "Show"} inline
        {isExpanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </Button>

      {/* Inline content view */}
      <InlineContent 
        content={content} 
        isExpanded={isExpanded}
        handleCheckboxChange={handleCheckboxChange}
        handleNestedCheckboxChange={handleNestedCheckboxChange}
      />

      {/* Floating window for content */}
      <FloatingWindow
        open={isFloatingWindowOpen}
        onClose={closeFloatingWindow}
        onMinimize={minimizeWindow}
        minimized={isMinimized}
        title={getContentTypeName(content.type, content.value)}
        size="auto"
      >
        <FloatingWindowContent 
          content={content}
          handleCheckboxChange={handleCheckboxChange}
          handleNestedCheckboxChange={handleNestedCheckboxChange}
        />
      </FloatingWindow>
    </div>
  );
}
