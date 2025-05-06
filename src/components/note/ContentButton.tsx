import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotebooks } from "@/contexts/NotebooksContext";
import { ChecklistItem, ContentItem, TableData } from "@/types";
import { Plus, Image, FileText, Link as LinkIcon, Pencil, CheckSquare, FileCode, Table } from "lucide-react";
import { getNewId } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DrawingCanvas } from "./DrawingCanvas";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";

interface ContentButtonProps {
  noteId: string;
  lineId: string;
}

export function ContentButton({ noteId, lineId }: ContentButtonProps) {
  const { addContentToLine } = useNotebooks();
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isDrawingDialogOpen, setIsDrawingDialogOpen] = useState(false);
  const [drawingData, setDrawingData] = useState("");
  const [isChecklistDialogOpen, setIsChecklistDialogOpen] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: getNewId("item"), text: "", checked: false }
  ]);
  const [isMarkdownDialogOpen, setIsMarkdownDialogOpen] = useState(false);
  const [markdownContent, setMarkdownContent] = useState("");
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [tableData, setTableData] = useState<TableData>({
    headers: ["", ""],
    rows: [["", ""]]
  });
  const [isJsonDialogOpen, setIsJsonDialogOpen] = useState(false);
  const [jsonData, setJsonData] = useState("");
  const [jsonImportType, setJsonImportType] = useState<"checklist" | "table">("checklist");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const content: ContentItem = {
          id: getNewId("content"),
          type: "image",
          value: reader.result as string,
          createdAt: new Date().toISOString(),
        };
        addContentToLine(noteId, lineId, content);
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/json") {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          setJsonData(reader.result as string);
          setIsJsonDialogOpen(true);
        } catch (error) {
          toast.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    } else {
      // For non-image, non-JSON files, just store the file name
      const content: ContentItem = {
        id: getNewId("content"),
        type: "file",
        value: file.name,
        createdAt: new Date().toISOString(),
      };
      addContentToLine(noteId, lineId, content);
    }
  };

  const handleLinkAdd = () => {
    if (linkUrl.trim()) {
      const content: ContentItem = {
        id: getNewId("content"),
        type: "link",
        value: linkUrl,
        createdAt: new Date().toISOString(),
      };
      addContentToLine(noteId, lineId, content);
      setLinkUrl("");
      setIsLinkDialogOpen(false);
    }
  };

  const handleDrawingSave = () => {
    if (drawingData) {
      const content: ContentItem = {
        id: getNewId("content"),
        type: "drawing",
        value: drawingData,
        createdAt: new Date().toISOString(),
      };
      addContentToLine(noteId, lineId, content);
      setDrawingData("");
      setIsDrawingDialogOpen(false);
    }
  };

  const handleAddChecklistItem = () => {
    setChecklistItems([
      ...checklistItems,
      { id: getNewId("item"), text: "", checked: false }
    ]);
  };

  const handleUpdateChecklistItem = (id: string, text: string) => {
    setChecklistItems(
      checklistItems.map(item => 
        item.id === id ? { ...item, text } : item
      )
    );
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklistItems(
      checklistItems.filter(item => item.id !== id)
    );
  };

  const handleAddNestedItem = (parentId: string) => {
    setChecklistItems(
      checklistItems.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), { id: getNewId("item"), text: "", checked: false }]
          };
        }
        return item;
      })
    );
  };

  const handleUpdateNestedItem = (parentId: string, itemId: string, text: string) => {
    setChecklistItems(
      checklistItems.map(item => {
        if (item.id === parentId && item.children) {
          return {
            ...item,
            children: item.children.map(child => 
              child.id === itemId ? { ...child, text } : child
            )
          };
        }
        return item;
      })
    );
  };

  const handleRemoveNestedItem = (parentId: string, itemId: string) => {
    setChecklistItems(
      checklistItems.map(item => {
        if (item.id === parentId && item.children) {
          return {
            ...item,
            children: item.children.filter(child => child.id !== itemId)
          };
        }
        return item;
      })
    );
  };

  const handleSaveChecklist = () => {
    // Filter out empty items and empty children
    const validItems = checklistItems
      .filter(item => item.text.trim() || (item.children && item.children.some(child => child.text.trim())))
      .map(item => ({
        ...item,
        children: item.children ? item.children.filter(child => child.text.trim()) : undefined
      }));
    
    if (validItems.length > 0) {
      const content: ContentItem = {
        id: getNewId("content"),
        type: "checklist",
        value: "Checklist",
        createdAt: new Date().toISOString(),
        checklistItems: validItems,
      };
      addContentToLine(noteId, lineId, content);
      setChecklistItems([{ id: getNewId("item"), text: "", checked: false }]);
      setIsChecklistDialogOpen(false);
    }
  };

  const handleSaveMarkdown = () => {
    if (markdownContent.trim()) {
      const content: ContentItem = {
        id: getNewId("content"),
        type: "markdown",
        value: markdownContent,
        createdAt: new Date().toISOString(),
      };
      addContentToLine(noteId, lineId, content);
      setMarkdownContent("");
      setIsMarkdownDialogOpen(false);
    }
  };

  const handleAddTableColumn = () => {
    setTableData({
      headers: [...tableData.headers, ""],
      rows: tableData.rows.map(row => [...row, ""])
    });
  };

  const handleAddTableRow = () => {
    setTableData({
      ...tableData,
      rows: [...tableData.rows, Array(tableData.headers.length).fill("")]
    });
  };

  const handleUpdateTableHeader = (index: number, value: string) => {
    const newHeaders = [...tableData.headers];
    newHeaders[index] = value;
    setTableData({
      ...tableData,
      headers: newHeaders
    });
  };

  const handleUpdateTableCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...tableData.rows];
    newRows[rowIndex][colIndex] = value;
    setTableData({
      ...tableData,
      rows: newRows
    });
  };

  const handleRemoveTableColumn = (colIndex: number) => {
    if (tableData.headers.length <= 2) return;
    
    setTableData({
      headers: tableData.headers.filter((_, idx) => idx !== colIndex),
      rows: tableData.rows.map(row => row.filter((_, idx) => idx !== colIndex))
    });
  };

  const handleRemoveTableRow = (rowIndex: number) => {
    if (tableData.rows.length <= 1) return;
    
    setTableData({
      ...tableData,
      rows: tableData.rows.filter((_, idx) => idx !== rowIndex)
    });
  };

  const handleSaveTable = () => {
    if (tableData.headers.some(header => header.trim()) && 
        tableData.rows.some(row => row.some(cell => cell.trim()))) {
      const content: ContentItem = {
        id: getNewId("content"),
        type: "table",
        value: "Table",
        createdAt: new Date().toISOString(),
        tableData: tableData
      };
      addContentToLine(noteId, lineId, content);
      setTableData({
        headers: ["", ""],
        rows: [["", ""]]
      });
      setIsTableDialogOpen(false);
    }
  };

  const handleImportJson = () => {
    try {
      const parsedData = JSON.parse(jsonData);
      
      if (jsonImportType === "checklist") {
        // Structure should be array of {text, checked, children?}
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          // Validate and convert data
          const validItems: ChecklistItem[] = parsedData.map((item: any) => ({
            id: getNewId("item"),
            text: item.text || "",
            checked: Boolean(item.checked),
            children: item.children ? item.children.map((child: any) => ({
              id: getNewId("item"),
              text: child.text || "",
              checked: Boolean(child.checked)
            })) : undefined
          }));
          
          const content: ContentItem = {
            id: getNewId("content"),
            type: "checklist",
            value: "Checklist",
            createdAt: new Date().toISOString(),
            checklistItems: validItems,
          };
          
          addContentToLine(noteId, lineId, content);
          setJsonData("");
          setIsJsonDialogOpen(false);
        } else {
          toast.error("Invalid JSON format for checklist");
        }
      } else if (jsonImportType === "table") {
        // Structure should be {headers: string[], rows: string[][]}
        if (parsedData.headers && Array.isArray(parsedData.headers) && 
            parsedData.rows && Array.isArray(parsedData.rows)) {
          
          const tableData: TableData = {
            headers: parsedData.headers,
            rows: parsedData.rows
          };
          
          const content: ContentItem = {
            id: getNewId("content"),
            type: "table",
            value: "Table",
            createdAt: new Date().toISOString(),
            tableData: tableData
          };
          
          addContentToLine(noteId, lineId, content);
          setJsonData("");
          setIsJsonDialogOpen(false);
        } else {
          toast.error("Invalid JSON format for table");
        }
      }
    } catch (error) {
      toast.error("Invalid JSON data");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="add-content-button h-7 w-7">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add content</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) => handleFileUpload(e as any);
            input.click();
          }}>
            <Image className="h-4 w-4 mr-2" />
            <span>Add Image</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.onchange = (e) => handleFileUpload(e as any);
            input.click();
          }}>
            <FileText className="h-4 w-4 mr-2" />
            <span>Add File</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsLinkDialogOpen(true)}>
            <LinkIcon className="h-4 w-4 mr-2" />
            <span>Add Link</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDrawingDialogOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            <span>Create Drawing</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsChecklistDialogOpen(true)}>
            <CheckSquare className="h-4 w-4 mr-2" />
            <span>Add Checklist</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsMarkdownDialogOpen(true)}>
            <FileCode className="h-4 w-4 mr-2" />
            <span>Add Markdown</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsTableDialogOpen(true)}>
            <Table className="h-4 w-4 mr-2" />
            <span>Add Table</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "application/json";
            input.onchange = (e) => handleFileUpload(e as any);
            input.click();
          }}>
            <FileCode className="h-4 w-4 mr-2" />
            <span>Import JSON Data</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="link-url" className="text-sm font-medium">
                URL
              </label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLinkAdd();
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleLinkAdd} disabled={!linkUrl.trim()}>
                Add Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Drawing Dialog */}
      <Dialog open={isDrawingDialogOpen} onOpenChange={setIsDrawingDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create Drawing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <DrawingCanvas onSave={setDrawingData} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDrawingDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleDrawingSave} disabled={!drawingData}>
                Save Drawing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Checklist Dialog with nested items */}
      <Dialog open={isChecklistDialogOpen} onOpenChange={setIsChecklistDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Checklist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[70vh] overflow-auto">
            <div className="space-y-4">
              {checklistItems.map((item, index) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={item.text}
                      onChange={(e) => handleUpdateChecklistItem(item.id, e.target.value)}
                      placeholder={`Item ${index + 1}`}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleAddNestedItem(item.id)}
                      title="Add Sub-item"
                    >
                      +
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      disabled={checklistItems.length === 1}
                    >
                      ×
                    </Button>
                  </div>
                  
                  {/* Nested items */}
                  {item.children && item.children.length > 0 && (
                    <div className="pl-6 space-y-2 border-l-2 border-muted">
                      {item.children.map((child) => (
                        <div key={child.id} className="flex items-center gap-2">
                          <Input
                            value={child.text}
                            onChange={(e) => handleUpdateNestedItem(item.id, child.id, e.target.value)}
                            placeholder="Sub-item"
                            className="flex-1"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRemoveNestedItem(item.id, child.id)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                type="button" 
                onClick={handleAddChecklistItem}
                className="w-full mt-2"
              >
                Add Item
              </Button>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsChecklistDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveChecklist} 
                disabled={checklistItems.every(item => !item.text.trim() && 
                  (!item.children || item.children.every(child => !child.text.trim())))}
              >
                Save Checklist
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Markdown Dialog */}
      <Dialog open={isMarkdownDialogOpen} onOpenChange={setIsMarkdownDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Add Markdown Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="markdown-content" className="text-sm font-medium">
                Enter Markdown
              </label>
              <Textarea
                id="markdown-content"
                placeholder="# Heading\n\nThis is a paragraph with **bold** and *italic* text.\n\n- List item 1\n- List item 2"
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                className="h-64 font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Supports standard Markdown syntax including headers, lists, links, and more.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsMarkdownDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveMarkdown} disabled={!markdownContent.trim()}>
                Add Markdown
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Table Dialog */}
      <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create Table</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[70vh] overflow-auto">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-border">
                <thead>
                  <tr>
                    <th className="w-10 border border-border bg-muted p-2"></th>
                    {tableData.headers.map((header, colIndex) => (
                      <th key={colIndex} className="border border-border p-0">
                        <div className="flex items-center">
                          <Input
                            value={header}
                            onChange={(e) => handleUpdateTableHeader(colIndex, e.target.value)}
                            placeholder={`Column ${colIndex + 1}`}
                            className="border-0 focus-visible:ring-0 text-center"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => handleRemoveTableColumn(colIndex)}
                            disabled={tableData.headers.length <= 2}
                          >
                            ×
                          </Button>
                        </div>
                      </th>
                    ))}
                    <th className="w-10 border border-border bg-muted p-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={handleAddTableColumn}
                      >
                        +
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="border border-border text-center p-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => handleRemoveTableRow(rowIndex)}
                          disabled={tableData.rows.length <= 1}
                        >
                          ×
                        </Button>
                      </td>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} className="border border-border p-0">
                          <Input
                            value={cell}
                            onChange={(e) => handleUpdateTableCell(rowIndex, colIndex, e.target.value)}
                            className="border-0 focus-visible:ring-0 text-center"
                          />
                        </td>
                      ))}
                      <td className="border border-border"></td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={tableData.headers.length + 2} className="border border-border text-center p-2">
                      <Button 
                        variant="ghost" 
                        onClick={handleAddTableRow}
                        className="w-full"
                      >
                        +
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsTableDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTable}>
                Save Table
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* JSON Import Dialog */}
      <Dialog open={isJsonDialogOpen} onOpenChange={setIsJsonDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Import JSON Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Tabs defaultValue="checklist" onValueChange={(value) => setJsonImportType(value as "checklist" | "table")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="checklist">Checklist</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
              </TabsList>
              <TabsContent value="checklist" className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  JSON format for checklists:
                </p>
                <pre className="bg-muted p-2 rounded-md overflow-auto text-xs">
                  {`[
  {
    "text": "Item 1",
    "checked": false,
    "children": [
      {
        "text": "Subitem 1",
        "checked": false
      }
    ]
  },
  {
    "text": "Item 2",
    "checked": true
  }
]`}
                </pre>
              </TabsContent>
              <TabsContent value="table" className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  JSON format for tables:
                </p>
                <pre className="bg-muted p-2 rounded-md overflow-auto text-xs">
                  {`{
  "headers": ["Name", "Email", "Phone"],
  "rows": [
    ["John Doe", "john@example.com", "123-456-7890"],
    ["Jane Smith", "jane@example.com", "234-567-8901"]
  ]
}`}
                </pre>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <label htmlFor="json-content" className="text-sm font-medium">
                JSON Data
              </label>
              <Textarea
                id="json-content"
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className="h-32 font-mono"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsJsonDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleImportJson} disabled={!jsonData.trim()}>
                Import {jsonImportType === "checklist" ? "Checklist" : "Table"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
