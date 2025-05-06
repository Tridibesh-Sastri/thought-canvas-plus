
export type ContentType = 'image' | 'drawing' | 'file' | 'link' | 'text';

export interface ContentItem {
  id: string;
  type: ContentType;
  value: string;
  createdAt: string;
}

export interface NoteLine {
  id: string;
  text: string;
  content?: ContentItem;
  tags: string[];
}

export interface Note {
  id: string;
  title: string;
  lines: NoteLine[];
  createdAt: string;
  updatedAt: string;
  linkedNotes: string[];
}

export interface Notebook {
  id: string;
  title: string;
  description?: string;
  notes: Note[];
  createdAt: string;
}
