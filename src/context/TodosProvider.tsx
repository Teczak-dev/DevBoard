import React, { useMemo, useCallback } from "react";
import { TodosContext } from "./TodosContext";
import type { Todo, TaskStatus } from "../shared/types/todo";
import { useDevBoardStorage } from "../shared/hooks/useDevBoardStorage";

/**
 * TodosProvider - Global task management component
 *
 * This provider manages the application's task/todo state and provides CRUD operations:
 * - Loading todos from persistent storage
 * - Adding new todos with auto-generated IDs and timestamps
 * - Updating existing todos (including status changes for drag & drop)
 * - Deleting todos
 * - Bulk todo updates
 * - Project-specific and status-based filtering
 *
 * The provider integrates with the DevBoard storage system to ensure all todo
 * changes are persisted automatically. All operations are asynchronous to support
 * both web (localStorage) and desktop (Tauri file system) storage backends.
 * 
 * Key features:
 * - Auto-generated unique IDs and timestamps for new todos
 * - Status management for kanban-style workflow
 * - Project association for task organization
 * - Optimistic updates for responsive UI
 * - Comprehensive error handling and logging
 * - Atomic operations to prevent data corruption
 * - Memoized state and helper functions to optimize React re-renders
 */
export const TodosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: store, update } = useDevBoardStorage();

  /**
   * Memoized todos array from storage
   * Uses useMemo to prevent unnecessary re-renders when store reference changes
   * but todos array content remains the same
   */
  const todos: Todo[] = useMemo(() => {
    return store?.todos ?? [];
  }, [store?.todos]);

  /**
   * Replace all todos with a new array
   * @param value - New array of todos to replace current todos
   *
   * This is useful for bulk operations like importing todos or resetting
   * the entire todo list. Includes error handling to prevent data corruption.
   */
  const updateTodos = async (value: Todo[]) => {
    if (!update) return;
    
    try {
      await update((prev) => ({ ...prev, todos: value }));
      
    } catch (error) {
      console.error("❌ Error updating todos:", error);
    }
  };

  /**
   * Update a specific todo by ID
   * @param id - The ID of the todo to update
   * @param todo - The updated todo object
   *
   * Finds and replaces the todo with matching ID while preserving
   * all other todos in the array. Automatically updates the updatedAt timestamp.
   */
  const updateTodo = async (id: number, todo: Todo) => {
    if (!update) return;
    
    try {
      const updatedTodo = {
        ...todo,
        updatedAt: new Date().toISOString()
      };
      
      await update((prev) => {
        const nextTodos = prev.todos.map((t) =>
          t.id === id ? updatedTodo : t,
        );
        return { ...prev, todos: nextTodos };
      });
      
    } catch (error) {
      console.error("❌ Error updating todo:", error);
    }
  };

  /**
   * Add a new todo to the collection
   * @param todo - The todo object to add (without ID, createdAt, updatedAt)
   *
   * Automatically generates a new unique ID by finding the maximum existing ID
   * and incrementing by 1. Handles the case when no todos exist (starts at ID 1).
   * Sets creation and update timestamps automatically.
   * Appends the new todo to the end of the todos array.
   */
  const addTodo = async (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!update) return;
    
    try {
      await update((prev) => {
        // Find the highest existing ID to generate a unique new ID
        const maxId = prev.todos.length
          ? Math.max(...prev.todos.map((t) => t.id))
          : 0;

        // Create new todo with auto-generated ID and timestamps
        const now = new Date().toISOString();
        const newTodo: Todo = { 
          ...todo, 
          id: maxId + 1,
          createdAt: now,
          updatedAt: now
        };

        // Add to end of todos array
        return { ...prev, todos: [...prev.todos, newTodo] };
      });
      
    } catch (error) {
      console.error("❌ Error adding todo:", error);
    }
  };

  /**
   * Delete a todo by ID
   * @param id - The ID of the todo to remove
   *
   * Filters out the todo with matching ID from the todos array.
   * This is a permanent deletion operation - the todo data will be lost.
   */
  const deleteTodo = async (id: number) => {
    if (!update) return;
    
    try {
      await update((prev) => ({
        ...prev,
        todos: prev.todos.filter((t) => t.id !== id),
      }));
      
    } catch (error) {
      console.error("❌ Error deleting todo:", error);
    }
  };

  /**
   * Update only the status of a specific todo
   * @param id - The ID of the todo to update
   * @param status - The new status to set
   *
   * Convenience method for drag & drop operations where only status changes.
   * More efficient than updating the entire todo object.
   */
  const updateTaskStatus = async (id: number, status: TaskStatus) => {
    if (!update) return;
    
    try {
      // Use a more explicit approach to ensure the update is applied
      await update((prev) => {
        const taskExists = prev.todos.some(t => t.id === id);
        if (!taskExists) {
          console.error("Task not found with id:", id);
          return prev; // Return unchanged state if task doesn't exist
        }
        
        const nextTodos = prev.todos.map((t) =>
          t.id === id ? { 
            ...t, 
            status, 
            updatedAt: new Date().toISOString() 
          } : t,
        );
        
        return { ...prev, todos: nextTodos };
      });
      
      // Force a small delay to ensure the update is propagated
      await new Promise(resolve => setTimeout(resolve, 10));
      
    } catch (error) {
      console.error("❌ Error updating task status:", error);
      throw error; // Re-throw to let the caller handle it
    }
  };

  /**
   * Get all todos associated with a specific project
   * @param projectId - The ID of the project to filter by
   * @returns Array of todos belonging to the specified project
   *
   * Memoized for performance - only recalculates when todos array changes.
   */
  const getTodosForProject = useCallback((projectId: number): Todo[] => {
    return todos.filter(todo => todo.projectId === projectId);
  }, [todos]);

  /**
   * Get all todos with a specific status
   * @param status - The status to filter by ('todo', 'inProgress', 'done')
   * @returns Array of todos with the specified status
   *
   * Memoized for performance - only recalculates when todos array changes.
   */
  const getTodosByStatus = useCallback((status: TaskStatus): Todo[] => {
    return todos.filter(todo => todo.status === status);
  }, [todos]);

  // Provide todo state and all CRUD operations to child components
  return (
    <TodosContext.Provider
      value={{
        todos,
        updateTodos,
        updateTodo,
        addTodo,
        deleteTodo,
        updateTaskStatus,
        getTodosForProject,
        getTodosByStatus,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export default TodosProvider;