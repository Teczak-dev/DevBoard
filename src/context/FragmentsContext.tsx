/**
 * FragmentsContext - Type definitions for markdown fragment management context
 * 
 * This module defines the TypeScript interfaces for the fragments context,
 * providing type safety for all fragment-related operations throughout the app.
 * 
 * All CRUD operations are asynchronous to support both localStorage (web)
 * and file system (Tauri) storage backends with consistent API.
 * 
 * The context provides:
 * - Read access to fragments array
 * - Async CRUD operations with error handling  
 * - Built-in fragment initialization
 * - Type-safe interfaces for all operations
 */

import { createContext } from "react";
import type { MarkdownFragment } from "../shared/types/fragment";

/**
 * Interface defining the complete fragments context API
 * All mutation operations are async to support persistent storage
 */
export interface FragmentsContextType {
  /** Current array of all fragments (built-in + custom) */
  fragments: MarkdownFragment[];
  
  /** Replace entire fragments array (bulk operation) */
  updateFragments: (value: MarkdownFragment[]) => Promise<void>;
  
  /** 
   * Add new fragment to collection
   * @param fragment - New fragment to add (id will be auto-generated)
   * @returns Promise resolving to the created fragment with assigned ID
   */
  addFragment: (fragment: Omit<MarkdownFragment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<MarkdownFragment>;
  
  /** 
   * Update existing fragment by ID  
   * @param id - Fragment ID to update
   * @param updates - Partial fragment data to update
   * @returns Promise resolving to updated fragment or null if not found
   */
  updateFragment: (id: number, updates: Partial<MarkdownFragment>) => Promise<MarkdownFragment | null>;
  
  /** 
   * Delete fragment by ID
   * @param id - Fragment ID to delete
   * @returns Promise resolving to boolean indicating success
   */
  deleteFragment: (id: number) => Promise<boolean>;
  
  /** 
   * Get fragment by ID
   * @param id - Fragment ID to retrieve
   * @returns Fragment or undefined if not found
   */
  getFragmentById: (id: number) => MarkdownFragment | undefined;
  
  /** 
   * Get fragments by category
   * @param category - Fragment category to filter by
   * @returns Array of fragments in the specified category
   */
  getFragmentsByCategory: (category: MarkdownFragment['category']) => MarkdownFragment[];
  
  /** 
   * Initialize built-in fragments if not already present
   * @returns Promise resolving when initialization is complete
   */
  initializeBuiltInFragments: () => Promise<void>;
}

/**
 * Create the fragments context with default undefined value
 * Will be provided by FragmentsProvider component
 */
export const FragmentsContext = createContext<FragmentsContextType | undefined>(undefined);