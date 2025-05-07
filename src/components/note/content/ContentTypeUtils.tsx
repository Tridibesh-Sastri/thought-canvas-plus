
export function getContentTypeName(type: string, value?: string): string {
  switch (type) {
    case "image":
      return "Image";
    case "drawing":
      return "Drawing";
    case "file":
      return value ? `File: ${value}` : "File";
    case "link":
      return value ? `Link: ${value}` : "Link";
    case "checklist":
      return "Checklist";
    case "markdown":
      return "Markdown";
    case "table":
      return "Table";
    default:
      return "Content";
  }
}
