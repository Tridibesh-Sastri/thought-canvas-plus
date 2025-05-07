
import { useState, useEffect } from "react";
import { useNotebooks } from "@/contexts/NotebooksContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Notebook, Note } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Save, FileText, Edit, Notebook as NotebookIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function JsonEditor() {
  const { notebooks, createNotebook, createNote, updateNote } = useNotebooks();
  const [jsonContent, setJsonContent] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"export" | "import" | "edit">("export");
  const [selectedType, setSelectedType] = useState<"notebook" | "note">("notebook");
  const [selectedNotebookId, setSelectedNotebookId] = useState<string>("");
  const [selectedNoteId, setSelectedNoteId] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Set initial notebook selection if available
    if (notebooks.length > 0 && !selectedNotebookId) {
      setSelectedNotebookId(notebooks[0].id);
    }
  }, [notebooks, selectedNotebookId]);

  useEffect(() => {
    if (activeTab === "export") {
      // Format the notebooks data whenever it changes
      const formattedJson = JSON.stringify(notebooks, null, 2);
      setJsonContent(formattedJson);
    } else if (activeTab === "edit" && selectedNotebookId) {
      if (selectedType === "notebook") {
        // Get the selected notebook
        const notebook = notebooks.find(n => n.id === selectedNotebookId);
        if (notebook) {
          setJsonContent(JSON.stringify(notebook, null, 2));
        }
      } else if (selectedType === "note" && selectedNoteId) {
        // Get the selected note
        const notebook = notebooks.find(n => n.id === selectedNotebookId);
        const note = notebook?.notes.find(n => n.id === selectedNoteId);
        if (note) {
          setJsonContent(JSON.stringify(note, null, 2));
        }
      }
    }
  }, [notebooks, activeTab, selectedType, selectedNotebookId, selectedNoteId]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonContent);
    toast.success("JSON copied to clipboard");
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      setJsonError(null);

      if (selectedType === "notebook") {
        if (!parsed.title) {
          setJsonError("Missing required field: title");
          return;
        }

        createNotebook(parsed.title, parsed.description);
        toast.success("Notebook created successfully!");
      } else if (selectedType === "note") {
        if (!parsed.notebookId || !parsed.title) {
          setJsonError("Missing required fields: notebookId or title");
          return;
        }

        createNote(parsed.notebookId, parsed.title);
        toast.success("Note created successfully!");
      }
    } catch (error) {
      setJsonError("Invalid JSON format");
    }
  };

  const handleUpdateJson = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      setJsonError(null);

      if (selectedType === "note" && selectedNoteId) {
        const notebook = notebooks.find(n => n.id === selectedNotebookId);
        const originalNote = notebook?.notes.find(n => n.id === selectedNoteId);
        
        if (originalNote) {
          // Preserve the note ID even if it was changed in the JSON
          const updatedNote = { ...parsed, id: selectedNoteId };
          updateNote(updatedNote);
          toast.success("Note updated successfully!");
        }
      } else {
        setJsonError("Updating notebooks directly is not supported yet");
        return;
      }
    } catch (error) {
      setJsonError("Invalid JSON format");
    }
  };

  const getTemplateJson = () => {
    if (selectedType === "notebook") {
      return JSON.stringify({
        title: "New Notebook Title",
        description: "Optional notebook description"
      }, null, 2);
    } else {
      return JSON.stringify({
        notebookId: selectedNotebookId || (notebooks[0]?.id || "notebook-id-here"),
        title: "New Note Title"
      }, null, 2);
    }
  };

  const handleUseTemplate = () => {
    setJsonContent(getTemplateJson());
    setJsonError(null);
  };

  const handleNotebookChange = (notebookId: string) => {
    setSelectedNotebookId(notebookId);
    setSelectedNoteId(""); // Reset note selection when notebook changes
  };

  const handleNoteChange = (noteId: string) => {
    setSelectedNoteId(noteId);
  };

  // Find the selected notebook
  const selectedNotebook = notebooks.find(notebook => notebook.id === selectedNotebookId);
  // Get the notes from the selected notebook
  const notesInSelectedNotebook = selectedNotebook?.notes || [];

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">JSON Content Manager</h1>
      <p className="text-muted-foreground mb-8">
        Import, export, and edit data in JSON format to integrate with AI agents or backup your content.
      </p>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "export" | "import" | "edit")}>
        <TabsList className="mb-6">
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="edit">Edit Data</TabsTrigger>
        </TabsList>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Export Your Data</CardTitle>
              <CardDescription>
                Copy your notebooks and notes data in JSON format for use with external tools or AI agents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Complete Data Structure</h2>
                <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </div>
              <ScrollArea className="h-[500px] border rounded-md">
                <pre className="bg-muted/50 p-4 rounded-md overflow-auto text-sm">
                  {jsonContent}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import Data</CardTitle>
              <CardDescription>
                Create new notebooks or notes by importing JSON data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">What would you like to create?</p>
                  <div className="flex space-x-2">
                    <Button 
                      variant={selectedType === "notebook" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType("notebook")}
                    >
                      Notebook
                    </Button>
                    <Button 
                      variant={selectedType === "note" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType("note")}
                    >
                      Note
                    </Button>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleUseTemplate}>
                  <FileText className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </div>
              
              {jsonError && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
                  {jsonError}
                </div>
              )}
              
              <Textarea 
                value={jsonContent} 
                onChange={(e) => setJsonContent(e.target.value)} 
                placeholder="Paste your JSON here..."
                className="font-mono h-[300px] mb-4"
              />
              
              <Button onClick={handleImportJson}>
                <Save className="h-4 w-4 mr-2" />
                {selectedType === "notebook" ? "Create Notebook" : "Create Note"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Edit Existing Data</CardTitle>
              <CardDescription>
                Modify your notebooks and notes by editing their JSON representation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 mb-6">
                <div className="flex flex-wrap gap-4">
                  <div className="space-y-1 min-w-[200px]">
                    <p className="text-sm font-medium">Item Type</p>
                    <div className="flex space-x-2">
                      <Button 
                        variant={selectedType === "notebook" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedType("notebook");
                          setSelectedNoteId("");
                        }}
                      >
                        <NotebookIcon className="h-4 w-4 mr-2" />
                        Notebook
                      </Button>
                      <Button 
                        variant={selectedType === "note" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedType("note")}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Note
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1 min-w-[200px]">
                    <label className="text-sm font-medium">Select Notebook</label>
                    <Select value={selectedNotebookId} onValueChange={handleNotebookChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a notebook" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Notebooks</SelectLabel>
                          {notebooks.map((notebook) => (
                            <SelectItem key={notebook.id} value={notebook.id}>
                              {notebook.title}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedType === "note" && (
                    <div className="space-y-1 min-w-[200px]">
                      <label className="text-sm font-medium">Select Note</label>
                      <Select
                        value={selectedNoteId}
                        onValueChange={handleNoteChange}
                        disabled={!selectedNotebookId || notesInSelectedNotebook.length === 0}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a note" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Notes</SelectLabel>
                            {notesInSelectedNotebook.map((note) => (
                              <SelectItem key={note.id} value={note.id}>
                                {note.title}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
              
              {jsonError && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
                  {jsonError}
                </div>
              )}
              
              <div className="mb-2 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "View Mode" : "Edit Mode"}
                </Button>
              </div>
              
              <Textarea 
                value={jsonContent} 
                onChange={(e) => setJsonContent(e.target.value)} 
                placeholder={selectedType === "notebook" ? "Select a notebook to edit..." : "Select a note to edit..."}
                className="font-mono h-[300px] mb-4"
                readOnly={!isEditing}
              />
              
              <Button 
                onClick={handleUpdateJson}
                disabled={!isEditing || (selectedType === "note" && !selectedNoteId) || (selectedType === "notebook")}
              >
                <Save className="h-4 w-4 mr-2" />
                Update {selectedType === "notebook" ? "Notebook" : "Note"}
              </Button>
              {selectedType === "notebook" && (
                <p className="text-xs text-muted-foreground mt-2">
                  Note: Updating notebooks directly is not supported yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
