
interface LinkContentProps {
  url: string;
}

export function LinkContent({ url }: LinkContentProps) {
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
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" 
        />
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" 
        />
      </svg>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-sm text-blue-600 hover:underline"
      >
        {url}
      </a>
    </div>
  );
}
