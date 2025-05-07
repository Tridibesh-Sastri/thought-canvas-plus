
import { ChecklistItem } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ChecklistContentProps {
  checklistItems: ChecklistItem[];
  onCheckboxChange: (item: ChecklistItem, checked: boolean) => void;
  onNestedCheckboxChange: (parentId: string, item: ChecklistItem, checked: boolean) => void;
  idPrefix?: string;
}

export function ChecklistContent({ 
  checklistItems, 
  onCheckboxChange, 
  onNestedCheckboxChange,
  idPrefix = "" 
}: ChecklistContentProps) {
  return (
    <div className="space-y-2">
      {checklistItems?.map((item) => (
        <div key={item.id} className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox 
              id={`${idPrefix}${item.id}-check`}
              checked={item.checked}
              onCheckedChange={(checked) => onCheckboxChange(item, checked === true)}
            />
            <label 
              htmlFor={`${idPrefix}${item.id}-check`}
              className={cn(
                "text-sm",
                item.checked && "line-through text-muted-foreground"
              )}
            >
              {item.text}
            </label>
          </div>
          
          {/* Nested items */}
          {item.children && item.children.length > 0 && (
            <div className="ml-6 space-y-2 border-l-2 border-muted pl-3">
              {item.children.map((child) => (
                <div key={child.id} className="flex items-center gap-2">
                  <Checkbox 
                    id={`${idPrefix}${child.id}-check`}
                    checked={child.checked}
                    onCheckedChange={(checked) => onNestedCheckboxChange(item.id, child, checked === true)}
                  />
                  <label 
                    htmlFor={`${idPrefix}${child.id}-check`}
                    className={cn(
                      "text-sm",
                      child.checked && "line-through text-muted-foreground"
                    )}
                  >
                    {child.text}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
