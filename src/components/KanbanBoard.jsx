
import React, { useState, useEffect } from "react";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import TaskColumn from "./TaskColumn";
import TaskFormDialog from "./TaskFormDialog";
import { TaskAPI } from "../backend/api";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load tasks when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await TaskAPI.getAllTasks();
        setTasks(fetchedTasks);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, []);

  // Filter tasks by their status
  const todoTasks = tasks.filter(task => task.status === "todo");
  const inProgressTasks = tasks.filter(task => task.status === "inprogress");
  const doneTasks = tasks.filter(task => task.status === "done");

  // Handle drag end for moving tasks between columns
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const taskId = active.id;
    const newStatus = over.id;
    
    if (newStatus !== "todo" && newStatus !== "inprogress" && newStatus !== "done") {
      return;
    }
    
    try {
      // Optimistically update UI
      setTasks(currentTasks => 
        currentTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: newStatus, updatedAt: new Date() } 
            : task
        )
      );
      
      // Update in backend
      await TaskAPI.updateTaskStatus(taskId, newStatus);
      
      toast({
        title: "Task updated",
        description: "Task moved successfully!",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to update task status:", error);
      
      // Revert optimistic update on failure
      const originalTasks = await TaskAPI.getAllTasks();
      setTasks(originalTasks);
      
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
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
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // Update existing task
        const updatedTask = await TaskAPI.updateTask(editingTask.id, taskData);
        
        setTasks(currentTasks => 
          currentTasks.map(task => 
            task.id === editingTask.id ? updatedTask : task
          )
        );
        
        toast({
          title: "Task updated",
          description: "Your task has been updated successfully!",
          duration: 3000,
        });
      } else {
        // Create new task
        const newTask = await TaskAPI.createTask(taskData);
        
        setTasks(currentTasks => [...currentTasks, newTask]);
        
        toast({
          title: "Task created",
          description: "Your new task has been created! ✨",
          duration: 3000,
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save task:", error);
      toast({
        title: "Error",
        description: "Failed to save task. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      // Optimistically update UI
      setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
      
      // Delete in backend
      await TaskAPI.deleteTask(taskId);
      
      toast({
        title: "Task deleted",
        description: "The task has been removed.",
        variant: "destructive",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to delete task:", error);
      
      // Revert optimistic update on failure
      const originalTasks = await TaskAPI.getAllTasks();
      setTasks(originalTasks);
      
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading tasks...</div>;
  }

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
