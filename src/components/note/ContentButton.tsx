import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotebooks } from "@/contexts/NotebooksContext";
import { ChecklistItem, ContentItem } from "@/types";
import { Plus, Image, FileText, Link as LinkIcon, Pencil, CheckSquare } from "lucide-react";
import { getNewId } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DrawingCanvas } from "./DrawingCanvas";

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
    } else {
      // For non-image files, just store the file name
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

  const handleSaveChecklist = () => {
    // Filter out empty items
    const validItems = checklistItems.filter(item => item.text.trim());
    
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

      {/* Checklist Dialog */}
      <Dialog open={isChecklistDialogOpen} onOpenChange={setIsChecklistDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Checklist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              {checklistItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Input
                    value={item.text}
                    onChange={(e) => handleUpdateChecklistItem(item.id, e.target.value)}
                    placeholder={`Item ${index + 1}`}
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    disabled={checklistItems.length === 1}
                  >
                    ×
                  </Button>
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
                disabled={checklistItems.every(item => !item.text.trim())}
              >
                Save Checklist
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
