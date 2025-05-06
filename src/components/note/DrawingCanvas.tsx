
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface DrawingCanvasProps {
  onSave: (imageData: string) => void;
}

export function DrawingCanvas({ onSave }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    // Set initial canvas background to white
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setContext(ctx);
  }, []);

  useEffect(() => {
    if (!context) return;
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.lineJoin = "round";
    context.lineCap = "round";
  }, [color, brushSize, context]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    
    let x, y;
    
    if ('touches' in e) {
      // Touch event
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    if (context) {
      context.beginPath();
      context.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    
    let x, y;
    
    if ('touches' in e) {
      // Touch event
      e.preventDefault();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (context) {
      context.closePath();
    }
    
    // Save the drawing data when stopping
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL("image/png");
      onSave(imageData);
    }
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    onSave("");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="space-x-2">
          <label htmlFor="brush-color" className="text-sm font-medium">
            Color:
          </label>
          <input
            id="brush-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-8 p-0 border-0"
          />
        </div>
        <div className="space-x-2">
          <label htmlFor="brush-size" className="text-sm font-medium">
            Size:
          </label>
          <input
            id="brush-size"
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
          />
        </div>
        <Button variant="outline" size="sm" onClick={clearCanvas}>
          Clear
        </Button>
      </div>
      
      <div className="border border-border rounded-md overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full max-h-[400px] touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        Draw your content using your mouse or touch device
      </p>
    </div>
  );
}
