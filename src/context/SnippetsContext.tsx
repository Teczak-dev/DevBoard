/**
 * SnippetsContext - Type definitions for snippet management context
 * 
 * This module defines the TypeScript interfaces for the snippets context,
 * providing type safety for all snippet-related operations throughout the app.
 * 
 * All CRUD operations are asynchronous to support both localStorage (web)
 * and file system (Tauri) storage backends with consistent API.
 * 
 * The context provides:
 * - Read access to snippets array
 * - Async CRUD operations with error handling
 * - Bulk operations for snippet management
 * - Type-safe interfaces for all operations
 */

import { createContext } from "react";
import type { Snippet } from "../shared/types/snippet";

/**
 * Interface defining the complete snippets context API
 * All mutation operations are async to support persistent storage
 */
export interface SnippetsContextType {
  /** Current array of all snippets */
  snippets: Snippet[];
  
  /** Replace entire snippets array (bulk operation) */
  updateSnippets: (value: Snippet[]) => Promise<void>;
  
  /** Update a single snippet by ID */
  updateSnippet: (id: number, snippet: Snippet) => Promise<void>;
  
  /** Add a new snippet (ID will be auto-generated) */
  addSnippet: (snippet: Snippet) => Promise<void>;
  
  /** Delete a snippet by ID (permanent operation) */
  deleteSnippet: (id: number) => Promise<void>;
}

/**
 * React context for snippet management
 * Provides null as default to enforce proper provider usage
 */
export const SnippetsContext = createContext<SnippetsContextType | null>(null);
