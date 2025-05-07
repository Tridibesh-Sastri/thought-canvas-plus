
import { ContentItem } from "@/types";
import { ChecklistContent } from "./ChecklistContent";
import { MarkdownDisplay } from "../MarkdownDisplay";
import { TableContent } from "./TableContent";
import { FileContent } from "./FileContent";
import { LinkContent } from "./LinkContent";
import { ImageContent } from "./ImageContent";

interface FloatingWindowContentProps {
  content: ContentItem;
  handleCheckboxChange: (item: any, checked: boolean) => void;
  handleNestedCheckboxChange: (parentId: string, item: any, checked: boolean) => void;
}

export function FloatingWindowContent({ 
  content, 
  handleCheckboxChange, 
  handleNestedCheckboxChange 
}: FloatingWindowContentProps) {
  switch (content.type) {
    case "image":
      return <ImageContent src={content.value} alt="Uploaded image" className="max-h-[60vh] max-w-full rounded" />;
    case "drawing":
      return <ImageContent src={content.value} alt="Drawing" className="max-h-[60vh] max-w-full rounded" />;
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
          idPrefix="floating-"
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
}
