
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNotebooks } from "@/contexts/NotebooksContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateNoteDialog } from "@/components/note/CreateNoteDialog";
import { formatDistanceToNow } from "date-fns";

export default function NotebookView() {
  const { notebookId } = useParams<{ notebookId: string }>();
  const { notebooks, setCurrentNotebook, setCurrentNote } = useNotebooks();

  const notebook = notebooks.find(nb => nb.id === notebookId);

  useEffect(() => {
    if (notebook) {
      setCurrentNotebook(notebook);
      setCurrentNote(null);
    }
  }, [notebook, setCurrentNotebook, setCurrentNote]);

  if (!notebook) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-medium">Notebook not found</h2>
          <p className="text-muted-foreground">
            The notebook you're looking for doesn't exist or has been deleted
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">{notebook.title}</h1>
          {notebook.description && (
            <p className="text-muted-foreground mt-1">{notebook.description}</p>
          )}
        </div>
        <CreateNoteDialog notebookId={notebook.id} />
      </div>

      {notebook.notes.length === 0 ? (
        <div className="bg-muted/40 rounded-lg p-8 text-center">
          <h2 className="text-xl font-medium">No notes yet</h2>
          <p className="text-muted-foreground mt-2">
            Create your first note to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notebook.notes.map((note) => (
            <Card key={note.id} className="hover:border-primary transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between">
                  <a 
                    href={`/notebooks/${notebook.id}/notes/${note.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {note.title}
                  </a>
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                </p>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="line-clamp-3">
                  {note.lines.map(line => line.text).join(' ')}
                </p>
                {note.linkedNotes.length > 0 && (
                  <div className="mt-2 flex gap-1 flex-wrap">
                    <span className="text-xs font-medium">Links:</span>
                    <span className="text-xs text-muted-foreground">
                      {note.linkedNotes.length} connected note{note.linkedNotes.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
