
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNotebooks } from "@/contexts/NotebooksContext";
import { NoteEditor } from "@/components/note/NoteEditor";

export default function NoteView() {
  const { notebookId, noteId } = useParams<{ notebookId: string; noteId: string }>();
  const { notebooks, setCurrentNotebook, setCurrentNote } = useNotebooks();

  const notebook = notebooks.find(nb => nb.id === notebookId);
  const note = notebook?.notes.find(n => n.id === noteId);

  useEffect(() => {
    if (notebook) {
      setCurrentNotebook(notebook);
    }
    if (note) {
      setCurrentNote(note);
    }
  }, [notebook, note, setCurrentNotebook, setCurrentNote]);

  if (!note) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-medium">Note not found</h2>
          <p className="text-muted-foreground">
            The note you're looking for doesn't exist or has been deleted
          </p>
        </div>
      </div>
    );
  }

  return <NoteEditor noteId={note.id} />;
}
