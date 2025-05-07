
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, Minimize } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

const floatingWindowVariants = cva(
  "fixed z-50 rounded-lg border shadow-lg transition-all",
  {
    variants: {
      position: {
        center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        topRight: "top-4 right-4",
        topLeft: "top-4 left-4",
        bottomRight: "bottom-4 right-4",
        bottomLeft: "bottom-4 left-4",
      },
      size: {
        sm: "w-[300px] max-h-[400px]",
        md: "w-[500px] max-h-[600px]",
        lg: "w-[700px] max-h-[800px]",
        auto: "max-w-[90vw] max-h-[80vh]",
      },
    },
    defaultVariants: {
      position: "center",
      size: "md",
    },
  }
)

export interface FloatingWindowProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof floatingWindowVariants> {
  open: boolean
  onClose: () => void
  onMinimize?: () => void
  title?: string
  minimized?: boolean
}

const FloatingWindow = React.forwardRef<HTMLDivElement, FloatingWindowProps>(
  ({ className, position, size, open, onClose, onMinimize, title, minimized = false, children, ...props }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false)
    const [position_, setPosition] = React.useState({ x: 0, y: 0 })
    const [initialPos, setInitialPos] = React.useState({ x: 0, y: 0 })
    const dragRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (!open) return
      // Reset position when opening
      setPosition({ x: 0, y: 0 })
    }, [open])

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      // Only start dragging when clicking on the header (not buttons)
      if ((e.target as HTMLElement).closest('button')) return
      
      setIsDragging(true)
      setInitialPos({ 
        x: e.clientX - position_.x, 
        y: e.clientY - position_.y 
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      setPosition({
        x: e.clientX - initialPos.x,
        y: e.clientY - initialPos.y
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    React.useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      } else {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }, [isDragging, initialPos])

    if (!open) return null

    const windowStyle = {
      transform: position ? `translate(${position_.x}px, ${position_.y}px)` : undefined,
      cursor: isDragging ? 'grabbing' : 'auto',
    }

    return (
      <>
        <div 
          className="fixed inset-0 z-40" 
          onClick={!isDragging ? onClose : undefined} 
        />
        <div
          ref={ref}
          className={cn(
            floatingWindowVariants({ position, size }), 
            "bg-background/80", // Transparent background
            className
          )}
          style={windowStyle}
          {...props}
        >
          <div 
            ref={dragRef}
            className="flex items-center justify-between border-b p-3 cursor-grab"
            onMouseDown={handleMouseDown}
          >
            <h3 className="text-sm font-medium">{title || "Content"}</h3>
            <div className="flex items-center gap-1">
              {onMinimize && (
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onMinimize}>
                  <Minimize className="h-4 w-4" />
                  <span className="sr-only">Minimize</span>
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>
          {!minimized && (
            <div className="p-4 overflow-auto" style={{ maxHeight: 'calc(80vh - 3rem)' }}>
              {children}
            </div>
          )}
        </div>
      </>
    )
  }
)
FloatingWindow.displayName = "FloatingWindow"

export { FloatingWindow }
