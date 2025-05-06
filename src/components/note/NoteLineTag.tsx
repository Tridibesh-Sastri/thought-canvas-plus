
import { cn } from "@/lib/utils";

interface NoteLineTagProps {
  tag: string;
}

export function NoteLineTag({ tag }: NoteLineTagProps) {
  const getTagClass = () => {
    switch (tag) {
      case "image":
        return "tag-image";
      case "drawing":
        return "tag-drawing";
      case "link":
        return "tag-link";
      case "file":
        return "tag-file";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return <span className={cn("tag", getTagClass())}>{tag}</span>;
}
