
import { ContentItem } from "@/types";
import { ChecklistContent } from "./ChecklistContent";
import { MarkdownDisplay } from "../MarkdownDisplay";
import { TableContent } from "./TableContent";
import { FileContent } from "./FileContent";
import { LinkContent } from "./LinkContent";
import { ImageContent } from "./ImageContent";
import { cn } from "@/lib/utils";

interface InlineContentProps {
  content: ContentItem;
  isExpanded: boolean;
  handleCheckboxChange: (item: any, checked: boolean) => void;
  handleNestedCheckboxChange: (parentId: string, item: any, checked: boolean) => void;
}

export function InlineContent({ 
  content, 
  isExpanded,
  handleCheckboxChange, 
  handleNestedCheckboxChange 
}: InlineContentProps) {
  if (!isExpanded) return null;

  const wrapperClass = (type: string) => cn(
    "content-preview", 
    type === "checklist" || type === "markdown" || type === "table" ? "p-3" : "",
    type === "file" || type === "link" ? "p-3 flex items-center gap-2 bg-muted/50" : ""
  );

  return (
    <div className={wrapperClass(content.type)}>
      {(() => {
        switch (content.type) {
          case "image":
            return <ImageContent src={content.value} alt="Uploaded image" />;
          case "drawing":
            return <ImageContent src={content.value} alt="Drawing" />;
          case "file":
            return <FileContent filename={content.value} />;
          case "link":
            return <LinkContent url={content.value} />;
          case "checklist":
            return (
              <ChecklistContent 
                checklistItems={content.checklistItems || []} 
                onCheckboxChange={handleCheckboxChange}
                onNestedCheckboxChange={handleNestedCheckboxChange}
              />
            );
          case "markdown":
            return <MarkdownDisplay content={content.value} />;
          case "table":
            return content.tableData ? (
              <TableContent headers={content.tableData.headers} rows={content.tableData.rows} />
            ) : null;
          default:
            return null;
        }
      })()}
    </div>
  );
}
