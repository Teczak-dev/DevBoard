import React, { useMemo } from "react";
import { SnippetsContext } from "./SnippetsContext";
import type { Snippet } from "../shared/types/snippet";
import { useDevBoardStorage } from "../shared/hooks/useDevBoardStorage";

/**
 * SnippetsProvider - Global snippet management component
 *
 * This provider manages the application's snippet state and provides CRUD operations:
 * - Loading snippets from persistent storage
 * - Adding new snippets with auto-generated IDs
 * - Updating existing snippets
 * - Deleting snippets
 * - Bulk snippet updates
 *
 * The provider integrates with the DevBoard storage system to ensure all snippet
 * changes are persisted automatically. All operations are asynchronous to support
 * both web (localStorage) and desktop (Tauri file system) storage backends.
 * 
 * Key features:
 * - Auto-generated unique IDs for new snippets
 * - Optimistic updates for responsive UI
 * - Comprehensive error handling and logging
 * - Atomic operations to prevent data corruption
 * - Memoized state to optimize React re-renders
 */
export const SnippetsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: store, update } = useDevBoardStorage();

  /**
   * Memoized snippets array from storage
   * Uses useMemo to prevent unnecessary re-renders when store reference changes
   * but snippets array content remains the same
   */
  const snippets: Snippet[] = useMemo(() => {
    return store?.snippets ?? [];
  }, [store?.snippets]);

  /**
   * Replace all snippets with a new array
   * @param value - New array of snippets to replace current snippets
   *
   * This is useful for bulk operations like importing snippets or resetting
   * the entire snippet list. Includes error handling to prevent data corruption.
   */
  const updateSnippets = async (value: Snippet[]) => {
    if (!update) return;
    
    try {
      await update((prev) => ({ ...prev, snippets: value }));
    } catch (error) {
      console.error("❌ Error updating snippets:", error);
    }
  };

  /**
   * Update a specific snippet by ID
   * @param id - The ID of the snippet to update
   * @param snippet - The updated snippet object
   *
   * Finds and replaces the snippet with matching ID while preserving
   * all other snippets in the array. Non-destructive operation.
   */
  const updateSnippet = async (id: number, snippet: Snippet) => {
    if (!update) return;
    
    try {
      await update((prev) => {
        const nextSnippets = prev.snippets.map((s) =>
          s.id === id ? snippet : s,
        );
        return { ...prev, snippets: nextSnippets };
      });
    } catch (error) {
      console.error("❌ Error updating snippet:", error);
    }
  };

  /**
   * Add a new snippet to the collection
   * @param snippet - The snippet object to add (without ID)
   *
   * Automatically generates a new unique ID by finding the maximum existing ID
   * and incrementing by 1. Handles the case when no snippets exist (starts at ID 1).
   * Appends the new snippet to the end of the snippets array.
   */
  const addSnippet = async (snippet: Snippet) => {
    if (!update) return;
    
    try {
      await update((prev) => {
        // Find the highest existing ID to generate a unique new ID
        const maxId = prev.snippets.length
          ? Math.max(...prev.snippets.map((s) => s.id))
          : 0;

        // Create new snippet with auto-generated ID
        const newSnippet = { ...snippet, id: maxId + 1 };

        // Add to end of snippets array
        return { ...prev, snippets: [...prev.snippets, newSnippet] };
      });
    } catch (error) {
      console.error("❌ Error adding snippet:", error);
    }
  };

  /**
   * Delete a snippet by ID
   * @param id - The ID of the snippet to remove
   *
   * Filters out the snippet with matching ID from the snippets array.
   * This is a permanent deletion operation - the snippet data will be lost.
   */
  const deleteSnippet = async (id: number) => {
    if (!update) return;
    
    try {
      await update((prev) => ({
        ...prev,
        snippets: prev.snippets.filter((s) => s.id !== id),
      }));
    } catch (error) {
      console.error("❌ Error deleting snippet:", error);
    }
  };

  // Provide snippet state and all CRUD operations to child components
  return (
    <SnippetsContext.Provider
      value={{
        snippets,
        updateSnippets,
        updateSnippet,
        addSnippet,
        deleteSnippet,
      }}
    >
      {children}
    </SnippetsContext.Provider>
  );
};

export default SnippetsProvider;
