
interface FileContentProps {
  filename: string;
}

export function FileContent({ filename }: FileContentProps) {
  return (
    <div className="p-3 flex items-center gap-2 bg-muted/50 rounded">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 text-muted-foreground" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
        />
      </svg>
      <span className="text-sm">{filename}</span>
    </div>
  );
}
