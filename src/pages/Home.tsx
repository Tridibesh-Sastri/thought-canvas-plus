
import { Button } from "@/components/ui/button";
import { useNotebooks } from "@/contexts/NotebooksContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { notebooks, createNotebook } = useNotebooks();
  const navigate = useNavigate();

  const handleCreateNotebook = () => {
    createNotebook("New Notebook");
    // Navigate to the notebook page after a short delay
    setTimeout(() => {
      navigate(`/notebooks/${notebooks[notebooks.length - 1].id}`);
    }, 100);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
          Welcome to ThoughtCanvas+
        </h1>
        <p className="text-xl text-muted-foreground">
          Capture your ideas in a beautiful, flexible note-taking app
        </p>
        
        <div className="p-6 bg-canvas-softGray rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Get started with these features:</h2>
          <ul className="space-y-3 text-left">
            <li className="flex gap-2">
              <span className="font-bold text-canvas-darkPurple">📚</span>
              <span>Create multiple notebooks to organize your thoughts</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-canvas-darkPurple">✏️</span>
              <span>Write notes with rich content like images, drawings, and links</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-canvas-darkPurple">🏷️</span>
              <span>Automatically tag content for better organization</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-canvas-darkPurple">🔄</span>
              <span>Link related notes together to build your knowledge graph</span>
            </li>
          </ul>
        </div>
        
        <div className="pt-6">
          <Button size="lg" onClick={handleCreateNotebook}>
            Create Your First Notebook
          </Button>
        </div>
      </div>
    </div>
  );
}
