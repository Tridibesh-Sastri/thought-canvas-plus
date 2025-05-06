import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Notebook, Note, NoteLine, ContentItem, ChecklistItem } from "@/types";
import { loadNotebooks, saveNotebooks, getNewId } from "@/lib/data";
import { toast } from "@/components/ui/sonner";

interface NotebooksContextType {
  notebooks: Notebook[];
  currentNotebook: Notebook | null;
  currentNote: Note | null;
  setCurrentNotebook: (notebook: Notebook | null) => void;
  setCurrentNote: (note: Note | null) => void;
  createNotebook: (title: string, description?: string) => void;
  createNote: (notebookId: string, title: string) => void;
  updateNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
  addLineToNote: (noteId: string, text: string) => void;
  updateLine: (noteId: string, lineId: string, text: string) => void;
  deleteLine: (noteId: string, lineId: string) => void;
  addContentToLine: (noteId: string, lineId: string, content: ContentItem) => void;
  addTagToLine: (noteId: string, lineId: string, tag: string) => void;
  linkNotes: (sourceNoteId: string, targetNoteId: string) => void;
  unlinkNotes: (sourceNoteId: string, targetNoteId: string) => void;
  updateChecklistItem: (noteId: string, lineId: string, itemId: string, updatedItem: ChecklistItem) => void;
}

const NotebooksContext = createContext<NotebooksContextType | undefined>(undefined);

export const NotebooksProvider = ({ children }: { children: ReactNode }) => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [currentNotebook, setCurrentNotebook] = useState<Notebook | null>(null);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  useEffect(() => {
    const loadedNotebooks = loadNotebooks();
    setNotebooks(loadedNotebooks);
    if (loadedNotebooks.length > 0) {
      setCurrentNotebook(loadedNotebooks[0]);
    }
  }, []);

  useEffect(() => {
    if (notebooks.length > 0) {
      saveNotebooks(notebooks);
    }
  }, [notebooks]);

  const createNotebook = (title: string, description?: string) => {
    const newNotebook: Notebook = {
      id: getNewId("notebook"),
      title,
      description,
      notes: [],
      createdAt: new Date().toISOString(),
    };

    setNotebooks([...notebooks, newNotebook]);
    setCurrentNotebook(newNotebook);
    toast.success("Notebook created!");
  };

  const createNote = (notebookId: string, title: string) => {
    const newNote: Note = {
      id: getNewId("note"),
      title,
      lines: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      linkedNotes: [],
    };

    setNotebooks(notebooks.map(notebook => {
      if (notebook.id === notebookId) {
        return {
          ...notebook,
          notes: [...notebook.notes, newNote]
        };
      }
      return notebook;
    }));

    setCurrentNote(newNote);
    toast.success("Note created!");
  };

  const updateNote = (updatedNote: Note) => {
    setNotebooks(notebooks.map(notebook => {
      if (notebook.notes.some(note => note.id === updatedNote.id)) {
        return {
          ...notebook,
          notes: notebook.notes.map(note => 
            note.id === updatedNote.id 
              ? { ...updatedNote, updatedAt: new Date().toISOString() } 
              : note
          )
        };
      }
      return notebook;
    }));

    setCurrentNote(updatedNote);
  };

  const deleteNote = (noteId: string) => {
    let deletedFromNotebookId: string | null = null;
    
    setNotebooks(notebooks.map(notebook => {
      if (notebook.notes.some(note => note.id === noteId)) {
        deletedFromNotebookId = notebook.id;
        return {
          ...notebook,
          notes: notebook.notes.filter(note => note.id !== noteId)
        };
      }
      return notebook;
    }));

    if (currentNote?.id === noteId) {
      setCurrentNote(null);
    }
    
    toast.success("Note deleted!");
  };

  const addLineToNote = (noteId: string, text: string) => {
    const newLine: NoteLine = {
      id: getNewId("line"),
      text,
      tags: [],
    };

    setNotebooks(notebooks.map(notebook => {
      return {
        ...notebook,
        notes: notebook.notes.map(note => {
          if (note.id === noteId) {
            return {
              ...note,
              lines: [...note.lines, newLine],
              updatedAt: new Date().toISOString()
            };
          }
          return note;
        })
      };
    }));

    if (currentNote?.id === noteId) {
      setCurrentNote({
        ...currentNote,
        lines: [...currentNote.lines, newLine],
        updatedAt: new Date().toISOString()
      });
    }
  };

  const updateLine = (noteId: string, lineId: string, text: string) => {
    setNotebooks(notebooks.map(notebook => {
      return {
        ...notebook,
        notes: notebook.notes.map(note => {
          if (note.id === noteId) {
            return {
              ...note,
              lines: note.lines.map(line => 
                line.id === lineId ? { ...line, text } : line
              ),
              updatedAt: new Date().toISOString()
            };
          }
          return note;
        })
      };
    }));

    if (currentNote?.id === noteId) {
      setCurrentNote({
        ...currentNote,
        lines: currentNote.lines.map(line => 
          line.id === lineId ? { ...line, text } : line
        ),
        updatedAt: new Date().toISOString()
      });
    }
  };

  const deleteLine = (noteId: string, lineId: string) => {
    setNotebooks(notebooks.map(notebook => {
      return {
        ...notebook,
        notes: notebook.notes.map(note => {
          if (note.id === noteId) {
            return {
              ...note,
              lines: note.lines.filter(line => line.id !== lineId),
              updatedAt: new Date().toISOString()
            };
          }
          return note;
        })
      };
    }));

    if (currentNote?.id === noteId) {
      setCurrentNote({
        ...currentNote,
        lines: currentNote.lines.filter(line => line.id !== lineId),
        updatedAt: new Date().toISOString()
      });
    }
  };

  const addContentToLine = (noteId: string, lineId: string, content: ContentItem) => {
    setNotebooks(notebooks.map(notebook => {
      return {
        ...notebook,
        notes: notebook.notes.map(note => {
          if (note.id === noteId) {
            return {
              ...note,
              lines: note.lines.map(line => 
                line.id === lineId 
                  ? { ...line, content, tags: [...line.tags, content.type] } 
                  : line
              ),
              updatedAt: new Date().toISOString()
            };
          }
          return note;
        })
      };
    }));

    if (currentNote?.id === noteId) {
      setCurrentNote({
        ...currentNote,
        lines: currentNote.lines.map(line => 
          line.id === lineId 
            ? { ...line, content, tags: [...line.tags, content.type] } 
            : line
        ),
        updatedAt: new Date().toISOString()
      });
    }

    toast.success(`${content.type} added to note!`);
  };

  const addTagToLine = (noteId: string, lineId: string, tag: string) => {
    setNotebooks(notebooks.map(notebook => {
      return {
        ...notebook,
        notes: notebook.notes.map(note => {
          if (note.id === noteId) {
            return {
              ...note,
              lines: note.lines.map(line => {
                if (line.id === lineId && !line.tags.includes(tag)) {
                  return {
                    ...line,
                    tags: [...line.tags, tag]
                  };
                }
                return line;
              }),
              updatedAt: new Date().toISOString()
            };
          }
          return note;
        })
      };
    }));

    if (currentNote?.id === noteId) {
      setCurrentNote({
        ...currentNote,
        lines: currentNote.lines.map(line => {
          if (line.id === lineId && !line.tags.includes(tag)) {
            return {
              ...line,
              tags: [...line.tags, tag]
            };
          }
          return line;
        }),
        updatedAt: new Date().toISOString()
      });
    }
  };

  const linkNotes = (sourceNoteId: string, targetNoteId: string) => {
    if (sourceNoteId === targetNoteId) return;

    setNotebooks(notebooks.map(notebook => {
      return {
        ...notebook,
        notes: notebook.notes.map(note => {
          if (note.id === sourceNoteId && !note.linkedNotes.includes(targetNoteId)) {
            return {
              ...note,
              linkedNotes: [...note.linkedNotes, targetNoteId],
              updatedAt: new Date().toISOString()
            };
          }
          return note;
        })
      };
    }));

    if (currentNote?.id === sourceNoteId) {
      setCurrentNote({
        ...currentNote,
        linkedNotes: [...currentNote.linkedNotes, targetNoteId],
        updatedAt: new Date().toISOString()
      });
    }

    toast.success("Notes linked!");
  };

  const unlinkNotes = (sourceNoteId: string, targetNoteId: string) => {
    setNotebooks(notebooks.map(notebook => {
      return {
        ...notebook,
        notes: notebook.notes.map(note => {
          if (note.id === sourceNoteId) {
            return {
              ...note,
              linkedNotes: note.linkedNotes.filter(id => id !== targetNoteId),
              updatedAt: new Date().toISOString()
            };
          }
          return note;
        })
      };
    }));

    if (currentNote?.id === sourceNoteId) {
      setCurrentNote({
        ...currentNote,
        linkedNotes: currentNote.linkedNotes.filter(id => id !== targetNoteId),
        updatedAt: new Date().toISOString()
      });
    }

    toast.success("Notes unlinked!");
  };

  const updateChecklistItem = (noteId: string, lineId: string, itemId: string, updatedItem: ChecklistItem) => {
    setNotebooks(notebooks.map(notebook => {
      return {
        ...notebook,
        notes: notebook.notes.map(note => {
          if (note.id === noteId) {
            return {
              ...note,
              lines: note.lines.map(line => {
                if (line.id === lineId && line.content && line.content.checklistItems) {
                  return {
                    ...line,
                    content: {
                      ...line.content,
                      checklistItems: line.content.checklistItems.map(item => 
                        item.id === itemId ? updatedItem : item
                      )
                    }
                  };
                }
                return line;
              }),
              updatedAt: new Date().toISOString()
            };
          }
          return note;
        })
      };
    }));

    if (currentNote?.id === noteId) {
      setCurrentNote({
        ...currentNote,
        lines: currentNote.lines.map(line => {
          if (line.id === lineId && line.content && line.content.checklistItems) {
            return {
              ...line,
              content: {
                ...line.content,
                checklistItems: line.content.checklistItems.map(item => 
                  item.id === itemId ? updatedItem : item
                )
              }
            };
          }
          return line;
        }),
        updatedAt: new Date().toISOString()
      });
    }
  };

  return (
    <NotebooksContext.Provider
      value={{
        notebooks,
        currentNotebook,
        currentNote,
        setCurrentNotebook,
        setCurrentNote,
        createNotebook,
        createNote,
        updateNote,
        deleteNote,
        addLineToNote,
        updateLine,
        deleteLine,
        addContentToLine,
        addTagToLine,
        linkNotes,
        unlinkNotes,
        updateChecklistItem,
      }}
    >
      {children}
    </NotebooksContext.Provider>
  );
};

export const useNotebooks = () => {
  const context = useContext(NotebooksContext);
  if (context === undefined) {
    throw new Error("useNotebooks must be used within a NotebooksProvider");
  }
  return context;
};
