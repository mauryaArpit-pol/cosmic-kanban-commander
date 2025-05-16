
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1 : undefined,
  } : undefined;
  
  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300";
    }
  };
  
  // Get emoji based on priority
  const getPriorityEmoji = (priority) => {
    switch (priority) {
      case "high":
        return "🔥";
      case "medium":
        return "⭐";
      case "low":
        return "✅";
    }
  };
  
  const lastUpdated = formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true });
  
  return (
    <Card 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab active:cursor-grabbing relative hover:shadow-md transition-shadow border",
        isDragging && "shadow-lg opacity-80 animate-pulse"
      )}
    >
      <span className="absolute top-2 right-2 text-sm">
        {getPriorityEmoji(task.priority)}
      </span>
      
      <CardContent className="pt-6 pb-2">
        <h3 className="font-medium text-base mb-2">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
        )}
        <span className={cn("inline-flex text-xs px-2 py-0.5 rounded-full", getPriorityColor(task.priority))}>
          {task.priority}
        </span>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0 pb-3 text-xs text-muted-foreground">
        <span>
          {lastUpdated}
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
          >
            <Edit className="h-3.5 w-3.5" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
