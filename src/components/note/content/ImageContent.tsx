
interface ImageContentProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageContent({ src, alt, className = "max-h-64 mx-auto rounded" }: ImageContentProps) {
  return (
    <div className="flex justify-center">
      <img src={src} alt={alt} className={className} />
    </div>
  );
}
