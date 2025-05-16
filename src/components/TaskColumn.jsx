
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskCard from "./TaskCard";

const TaskColumn = ({ title, tasks, status, emptyStateMessage, onEdit, onDelete }) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });
  
  // Define column header color based on status
  const getHeaderColor = () => {
    switch (status) {
      case "todo":
        return "bg-blue-50 dark:bg-blue-950/30";
      case "inprogress":
        return "bg-amber-50 dark:bg-amber-950/30";
      case "done":
        return "bg-green-50 dark:bg-green-950/30";
      default:
        return "";
    }
  };
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className={getHeaderColor()}>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="h-6 w-6 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-medium">
            {tasks.length}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4" ref={setNodeRef}>
        {tasks.length > 0 ? (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center text-center text-muted-foreground border border-dashed rounded-md">
            {emptyStateMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskColumn;
