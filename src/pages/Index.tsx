
import { MainLayout } from "@/components/layout/MainLayout";
import { NotebooksProvider } from "@/contexts/NotebooksContext";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import NotebookView from "./NotebookView";
import NoteView from "./NoteView";
import NotFound from "./NotFound";

const Index = () => {
  return (
    <NotebooksProvider>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notebooks/:notebookId" element={<NotebookView />} />
          <Route path="/notebooks/:notebookId/notes/:noteId" element={<NoteView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </NotebooksProvider>
  );
};

export default Index;
