/**
 * Custom hook for accessing todos context
 * 
 * Provides a convenient way to access the todos context with built-in error handling.
 * Throws an informative error if used outside of TodosProvider, helping developers
 * identify context provider issues during development.
 * 
 * @returns TodosContextType - The todos context value with all CRUD operations
 * @throws Error if used outside of TodosProvider
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { todos, addTodo, updateTaskStatus } = useTodos();
 *   
 *   const handleAddTask = () => {
 *     addTodo({
 *       title: "New Task",
 *       description: "Task description",
 *       status: "todo",
 *       color: "#3B82F6",
 *       projectId: 1
 *     });
 *   };
 *   
 *   return <div>...</div>;
 * };
 * ```
 */

import { useContext } from "react";
import { TodosContext, type TodosContextType } from "../../context/TodosContext";

export const useTodos = (): TodosContextType => {
  const context = useContext(TodosContext);
  
  if (!context) {
    throw new Error(
      "useTodos must be used within a TodosProvider. " +
      "Make sure your component is wrapped in <TodosProvider>."
    );
  }
  
  return context;
};