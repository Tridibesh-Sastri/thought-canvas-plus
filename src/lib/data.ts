
import { Notebook } from "@/types";

export const defaultNotebooks: Notebook[] = [
  {
    id: "notebook-1",
    title: "Personal",
    description: "My personal thoughts and ideas",
    notes: [
      {
        id: "note-1",
        title: "My First Note",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lines: [
          {
            id: "line-1",
            text: "This is my first note in ThoughtCanvas+",
            tags: [],
          },
          {
            id: "line-2",
            text: "I can add different types of content using the + button",
            tags: [],
          },
        ],
        linkedNotes: [],
      }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "notebook-2",
    title: "Work",
    description: "Project ideas and meeting notes",
    notes: [],
    createdAt: new Date().toISOString(),
  },
];

// Local storage functions
export const saveNotebooks = (notebooks: Notebook[]) => {
  localStorage.setItem("notebooks", JSON.stringify(notebooks));
};

export const loadNotebooks = (): Notebook[] => {
  const stored = localStorage.getItem("notebooks");
  if (!stored) {
    saveNotebooks(defaultNotebooks);
    return defaultNotebooks;
  }
  return JSON.parse(stored);
};

export const getNewId = (prefix: string) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};
