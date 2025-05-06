
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "lucide-react";
import { useNotebooks } from "@/contexts/NotebooksContext";

interface LinkNotesDialogProps {
  noteId: string;
}

export function LinkNotesDialog({ noteId }: LinkNotesDialogProps) {
  const [open, setOpen] = useState(false);
  const { notebooks, currentNote, linkNotes, unlinkNotes } = useNotebooks();
  
  // Get all notes across notebooks except the current one
  const allOtherNotes = notebooks
    .flatMap(notebook => notebook.notes)
    .filter(note => note.id !== noteId);
  
  const linkedNoteIds = currentNote?.linkedNotes || [];

  const handleLinkToggle = (targetNoteId: string) => {
    if (linkedNoteIds.includes(targetNoteId)) {
      unlinkNotes(noteId, targetNoteId);
    } else {
      linkNotes(noteId, targetNoteId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Link className="h-4 w-4 mr-2" />
          Link Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Link to Other Notes</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <ScrollArea className="h-72">
            <div className="space-y-4">
              {allOtherNotes.length > 0 ? (
                allOtherNotes.map((note) => (
                  <div key={note.id} className="flex items-start space-x-3 px-1">
                    <Checkbox
                      id={`link-${note.id}`}
                      checked={linkedNoteIds.includes(note.id)}
                      onCheckedChange={() => handleLinkToggle(note.id)}
                    />
                    <div className="space-y-1">
                      <label
                        htmlFor={`link-${note.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {note.title}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {note.lines.length} line{note.lines.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No other notes available to link
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
