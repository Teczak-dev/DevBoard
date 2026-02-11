/**
 * TodosContext - Type definitions for task management context
 * 
 * This module defines the TypeScript interfaces for the todos/tasks context,
 * providing type safety for all task-related operations throughout the app.
 * 
 * All CRUD operations are asynchronous to support both localStorage (web)
 * and file system (Tauri) storage backends with consistent API.
 * 
 * The context provides:
 * - Read access to todos array
 * - Async CRUD operations with error handling
 * - Project-specific task filtering
 * - Status management for task workflow
 * - Type-safe interfaces for all operations
 */

import { createContext } from "react";
import type { Todo, TaskStatus } from "../shared/types/todo";

/**
 * Interface defining the complete todos context API
 * All mutation operations are async to support persistent storage
 */
export interface TodosContextType {
  /** Current array of all todos/tasks */
  todos: Todo[];
  
  /** Replace entire todos array (bulk operation) */
  updateTodos: (value: Todo[]) => Promise<void>;
  
  /** Update a single todo by ID */
  updateTodo: (id: number, todo: Todo) => Promise<void>;
  
  /** Add a new todo (ID will be auto-generated) */
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  
  /** Delete a todo by ID (permanent operation) */
  deleteTodo: (id: number) => Promise<void>;
  
  /** Update task status (for drag & drop) */
  updateTaskStatus: (id: number, status: TaskStatus) => Promise<void>;
  
  /** Get todos for a specific project */
  getTodosForProject: (projectId: number) => Todo[];
  
  /** Get todos by status */
  getTodosByStatus: (status: TaskStatus) => Todo[];
}

/**
 * React context for todo/task management
 * Provides null as default to enforce proper provider usage
 */
export const TodosContext = createContext<TodosContextType | null>(null);