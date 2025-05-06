
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotebooks } from "@/contexts/NotebooksContext";
import { Book } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AppSidebar() {
  const { notebooks, currentNotebook, setCurrentNotebook, currentNote, setCurrentNote } = useNotebooks();
  const navigate = useNavigate();

  const handleNotebookClick = (notebook: any) => {
    setCurrentNotebook(notebook);
    setCurrentNote(null);
    navigate(`/notebooks/${notebook.id}`);
  };

  const handleNoteClick = (note: any) => {
    setCurrentNote(note);
    if (currentNotebook) {
      navigate(`/notebooks/${currentNotebook.id}/notes/${note.id}`);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-2">
        <div className="flex items-center space-x-2">
          <Book className="h-5 w-5 text-primary" />
          <span className="font-medium">Your Notebooks</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          {notebooks.map((notebook) => (
            <SidebarGroup key={notebook.id}>
              <SidebarGroupLabel 
                onClick={() => handleNotebookClick(notebook)}
                className={`cursor-pointer px-4 py-2 ${
                  currentNotebook?.id === notebook.id ? "text-primary font-medium" : ""
                }`}
              >
                {notebook.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {notebook.notes.map((note) => (
                  <div 
                    key={note.id}
                    onClick={() => handleNoteClick(note)} 
                    className={`px-6 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors ${
                      currentNote?.id === note.id ? "bg-accent text-accent-foreground font-medium" : ""
                    }`}
                  >
                    {note.title}
                  </div>
                ))}
                {notebook.notes.length === 0 && (
                  <div className="px-6 py-2 text-sm text-muted-foreground italic">
                    No notes yet
                  </div>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
          {notebooks.length === 0 && (
            <div className="px-4 py-4 text-center">
              <p className="text-muted-foreground">No notebooks yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your first notebook using the button in the header
              </p>
            </div>
          )}
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
