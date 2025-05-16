
// Backend API service for task management
import { toast } from "@/hooks/use-toast";
import { generateId } from "@/lib/utils";

// Sample initial data
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

// In-memory data store
let tasks = [...initialTasks];

// API functions
export const TaskAPI = {
  // Get all tasks
  getAllTasks: () => {
    return Promise.resolve([...tasks]);
  },
  
  // Get task by ID
  getTaskById: (id) => {
    const task = tasks.find(task => task.id === id);
    return Promise.resolve(task || null);
  },
  
  // Add new task
  createTask: (taskData) => {
    const newTask = {
      id: generateId(),
      title: taskData.title || "",
      description: taskData.description || "",
      status: taskData.status || "todo",
      priority: taskData.priority || "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    tasks.push(newTask);
    return Promise.resolve(newTask);
  },
  
  // Update existing task
  updateTask: (id, taskData) => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return Promise.reject(new Error("Task not found"));
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...taskData,
      updatedAt: new Date()
    };
    
    tasks[taskIndex] = updatedTask;
    return Promise.resolve(updatedTask);
  },
  
  // Update task status (for drag and drop)
  updateTaskStatus: (id, newStatus) => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return Promise.reject(new Error("Task not found"));
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      status: newStatus,
      updatedAt: new Date()
    };
    
    tasks[taskIndex] = updatedTask;
    return Promise.resolve(updatedTask);
  },
  
  // Delete task
  deleteTask: (id) => {
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);
    
    if (tasks.length === initialLength) {
      return Promise.reject(new Error("Task not found"));
    }
    
    return Promise.resolve(true);
  }
};
