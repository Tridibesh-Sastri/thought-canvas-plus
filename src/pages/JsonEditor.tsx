
import { useState, useEffect } from "react";
import { useNotebooks } from "@/contexts/NotebooksContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Notebook, Note } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Save, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function JsonEditor() {
  const { notebooks, createNotebook, createNote } = useNotebooks();
  const [jsonContent, setJsonContent] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"export" | "import">("export");
  const [selectedType, setSelectedType] = useState<"notebook" | "note">("notebook");

  useEffect(() => {
    // Format the notebooks data whenever it changes
    const formattedJson = JSON.stringify(notebooks, null, 2);
    setJsonContent(formattedJson);
  }, [notebooks]);

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

  const getTemplateJson = () => {
    if (selectedType === "notebook") {
      return JSON.stringify({
        title: "New Notebook Title",
        description: "Optional notebook description"
      }, null, 2);
    } else {
      return JSON.stringify({
        notebookId: notebooks[0]?.id || "notebook-id-here",
        title: "New Note Title"
      }, null, 2);
    }
  };

  const handleUseTemplate = () => {
    setJsonContent(getTemplateJson());
    setJsonError(null);
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">JSON Content Manager</h1>
      <p className="text-muted-foreground mb-8">
        Import and export data in JSON format to integrate with AI agents or backup your content.
      </p>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "export" | "import")}>
        <TabsList className="mb-6">
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="import">Import Data</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
