import { useEffect, useState } from "react";
import { useNotebooks } from "@/contexts/NotebooksContext";
import { Button } from "@/components/ui/button";
import { ContentButton } from "./ContentButton";
import { ContentDisplay } from "./ContentDisplay";
import { NoteLineTag } from "./NoteLineTag";
import { Input } from "@/components/ui/input";
import { LinkNotesDialog } from "./LinkNotesDialog";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/components/ui/sonner";
import { Trash2 } from "lucide-react";

interface NoteEditorProps {
  noteId: string;
}

export function NoteEditor({ noteId }: NoteEditorProps) {
  const { notebooks, currentNote, updateNote, addLineToNote, updateLine, deleteLine } = useNotebooks();
  
  const [newLine, setNewLine] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState("");

  const linkedNotes = currentNote?.linkedNotes.map(id => {
    // Find the note with this id across all notebooks
    for (const notebook of notebooks) {
      const note = notebook.notes.find(n => n.id === id);
      if (note) return note;
    }
    return null;
  }).filter(Boolean) || [];

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
    }
  }, [currentNote]);

  if (!currentNote) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-medium">No note selected</h2>
          <p className="text-muted-foreground">
            Select a note from the sidebar or create a new one
          </p>
        </div>
      </div>
    );
  }

  const handleSaveLine = () => {
    if (newLine.trim()) {
      addLineToNote(noteId, newLine);
      setNewLine("");
    }
  };

  const handleUpdateTitle = () => {
    if (title.trim() && title !== currentNote.title) {
      updateNote({
        ...currentNote,
        title: title
      });
      toast.success("Title updated!");
    }
    setEditingTitle(false);
  };

  const handleDeleteLine = (lineId: string) => {
    deleteLine(noteId, lineId);
  };
  
  // Format the date to be more readable
  const formattedDate = formatDistanceToNow(new Date(currentNote.updatedAt), { 
    addSuffix: true,
    includeSeconds: true
  });
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          {editingTitle ? (
            <div className="flex gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-heading font-bold h-auto"
                autoFocus
                onBlur={handleUpdateTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUpdateTitle();
                  }
                }}
              />
              <Button variant="ghost" size="sm" onClick={handleUpdateTitle}>
                Save
              </Button>
            </div>
          ) : (
            <h1 
              className="text-2xl font-heading font-bold cursor-pointer hover:text-primary transition-colors"
              onClick={() => setEditingTitle(true)}
            >
              {currentNote.title}
            </h1>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Updated {formattedDate}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <LinkNotesDialog noteId={noteId} />
        </div>
      </div>
      
      {linkedNotes.length > 0 && (
        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-1">Linked Notes:</p>
          <div className="flex flex-wrap gap-2">
            {linkedNotes.map((note) => (
              <Button 
                key={note?.id}
                variant="outline" 
                size="sm" 
                className="h-7 px-2 text-xs"
                asChild
              >
                <a href={`/notebooks/${notebooks.find(nb => nb.notes.some(n => n.id === note?.id))?.id}/notes/${note?.id}`}>
                  {note?.title}
                </a>
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-1">
        {currentNote.lines.map((line) => (
          <div key={line.id} className="group relative">
            <div className="note-line group-hover:bg-accent/30 rounded px-1">
              <Input
                value={line.text}
                onChange={(e) => updateLine(noteId, line.id, e.target.value)}
                className="border-0 focus-visible:ring-0 p-0"
              />
              <ContentButton noteId={noteId} lineId={line.id} />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 absolute right-0 text-destructive/80 hover:text-destructive"
                onClick={() => handleDeleteLine(line.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            {line.content && (
              <ContentDisplay content={line.content} />
            )}
            
            {line.tags.length > 0 && (
              <div className="flex gap-1 mt-1 ml-1">
                {line.tags.map((tag) => (
                  <NoteLineTag key={tag} tag={tag} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="note-line mt-4">
        <Input
          placeholder="Type to add a new line..."
          value={newLine}
          onChange={(e) => setNewLine(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSaveLine();
            }
          }}
          className="border-dashed"
        />
      </div>
    </div>
  );
}
