
import React, { useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import TaskColumn from "./TaskColumn";
import TaskFormDialog from "./TaskFormDialog";
import { generateId } from "@/lib/utils";

// Initialize with some sample tasks
const initialTasks = [
  {
    id: generateId(),
    title: "Research project requirements",
    description: "Gather all necessary information for the upcoming project",
    status: "todo",
    priority: "high",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    title: "Design user interface mockups",
    description: "Create wireframes for the main dashboard",
    status: "inprogress",
    priority: "medium",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    title: "Update documentation",
    description: "Update the API documentation with new endpoints",
    status: "done",
    priority: "low",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter tasks by their status
  const todoTasks = tasks.filter(task => task.status === "todo");
  const inProgressTasks = tasks.filter(task => task.status === "inprogress");
  const doneTasks = tasks.filter(task => task.status === "done");

  // Handle drag end for moving tasks between columns
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const taskId = active.id;
    const newStatus = over.id;
    
    if (newStatus !== "todo" && newStatus !== "inprogress" && newStatus !== "done") {
      return;
    }
    
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updatedAt: new Date() } 
          : task
      )
    );
    
    toast({
      title: "Task updated",
      description: "Task moved successfully!",
      duration: 3000,
    });
  };

  // Open dialog to add a new task
  const handleAddTask = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  // Open dialog to edit an existing task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  // Handle task save (create or update)
  const handleSaveTask = (taskData) => {
    if (editingTask) {
      // Update existing task
      setTasks(currentTasks => 
        currentTasks.map(task => 
          task.id === editingTask.id 
            ? { ...task, ...taskData, updatedAt: new Date() } 
            : task
        )
      );
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully!",
        duration: 3000,
      });
    } else {
      // Create new task
      const newTask = {
        id: generateId(),
        title: taskData.title || "",
        description: taskData.description || "",
        status: taskData.status || "todo",
        priority: taskData.priority || "medium",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setTasks(currentTasks => [...currentTasks, newTask]);
      toast({
        title: "Task created",
        description: "Your new task has been created! ✨",
        duration: 3000,
      });
    }
    
    setIsDialogOpen(false);
  };

  // Delete a task
  const handleDeleteTask = (taskId) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "The task has been removed.",
      variant: "destructive",
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Lovable Kanban Board</h1>
        <Button onClick={handleAddTask} className="gap-2">
          <Plus size={18} />
          Add Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <TaskColumn 
            title="To Do" 
            tasks={todoTasks} 
            status="todo" 
            onEdit={handleEditTask} 
            onDelete={handleDeleteTask}
            emptyStateMessage="Nothing to do? Add a new task to get started! 📝"
          />
          <TaskColumn 
            title="In Progress" 
            tasks={inProgressTasks} 
            status="inprogress" 
            onEdit={handleEditTask} 
            onDelete={handleDeleteTask}
            emptyStateMessage="No tasks in progress. What are you working on? 🛠️"
          />
          <TaskColumn 
            title="Done" 
            tasks={doneTasks} 
            status="done" 
            onEdit={handleEditTask} 
            onDelete={handleDeleteTask}
            emptyStateMessage="Nothing completed yet. You'll get there! 🌱"
          />
        </DndContext>
      </div>
      
      <TaskFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default KanbanBoard;
