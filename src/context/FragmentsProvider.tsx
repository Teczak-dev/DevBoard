/**
 * FragmentsProvider - React context provider for markdown fragment management
 * 
 * This provider component manages the global state for markdown fragments,
 * including both built-in system fragments and user-created custom fragments.
 * 
 * Features:
 * - Persistent storage via DevBoard storage system
 * - Auto-initialization of built-in fragments
 * - CRUD operations for custom fragments
 * - Type-safe context API
 * - Automatic ID generation and timestamp management
 */

import React, { useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { FragmentsContext } from "./FragmentsContext";
import type { MarkdownFragment } from "../shared/types/fragment";
import { BUILT_IN_FRAGMENTS } from "../shared/types/fragment";
import { useDevBoardStorage } from "../shared/hooks/useDevBoardStorage";

interface FragmentsProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages markdown fragments state and operations
 */
export const FragmentsProvider: React.FC<FragmentsProviderProps> = ({ children }) => {
  const { data: store, update } = useDevBoardStorage();
  
  // Get fragments from storage or initialize with built-in ones
  const fragments = useMemo(() => {
    if (!store?.fragments || store.fragments.length === 0) {
      // Initialize with built-in fragments
      const now = new Date();
      return BUILT_IN_FRAGMENTS.map((fragment, index) => ({
        ...fragment,
        id: index + 1,
        createdAt: now,
        updatedAt: now,
      }));
    }
    return store.fragments;
  }, [store?.fragments]);

  /**
   * Save fragments to storage
   */
  const saveFragments = useCallback(async (newFragments: MarkdownFragment[]) => {
    try {
      await update(prevStore => ({
        ...prevStore,
        fragments: newFragments,
      }));
    } catch (error) {
      console.error("Failed to save fragments:", error);
      throw new Error("Failed to save fragments");
    }
  }, [update]);

  /**
   * Initialize built-in fragments if not already present
   */
  const initializeBuiltInFragments = useCallback(async () => {
    if (!store?.fragments || store.fragments.length === 0) {
      const now = new Date();
      const builtInFragments: MarkdownFragment[] = BUILT_IN_FRAGMENTS.map((fragment, index) => ({
        ...fragment,
        id: index + 1,
        createdAt: now,
        updatedAt: now,
      }));
      
      await saveFragments(builtInFragments);
    }
  }, [store?.fragments, saveFragments]);

  /**
   * Replace entire fragments array (bulk operation)
   */
  const updateFragments = useCallback(async (newFragments: MarkdownFragment[]) => {
    await saveFragments(newFragments);
  }, [saveFragments]);

  /**
   * Add new fragment to collection
   */
  const addFragment = useCallback(async (fragmentData: Omit<MarkdownFragment, 'id' | 'createdAt' | 'updatedAt'>): Promise<MarkdownFragment> => {
    const now = new Date();
    const maxId = fragments.length > 0 ? Math.max(...fragments.map(f => f.id)) : 0;
    
    const newFragment: MarkdownFragment = {
      ...fragmentData,
      id: maxId + 1,
      createdAt: now,
      updatedAt: now,
    };

    const updatedFragments = [...fragments, newFragment];
    await saveFragments(updatedFragments);
    
    return newFragment;
  }, [fragments, saveFragments]);

  /**
   * Update existing fragment by ID
   */
  const updateFragment = useCallback(async (id: number, updates: Partial<MarkdownFragment>): Promise<MarkdownFragment | null> => {
    const fragmentIndex = fragments.findIndex(f => f.id === id);
    if (fragmentIndex === -1) {
      return null;
    }

    const updatedFragment: MarkdownFragment = {
      ...fragments[fragmentIndex],
      ...updates,
      id, // Ensure ID cannot be changed
      updatedAt: new Date(),
    };

    const updatedFragments = [...fragments];
    updatedFragments[fragmentIndex] = updatedFragment;
    
    await saveFragments(updatedFragments);
    
    return updatedFragment;
  }, [fragments, saveFragments]);

  /**
   * Delete fragment by ID
   */
  const deleteFragment = useCallback(async (id: number): Promise<boolean> => {
    const fragmentToDelete = fragments.find(f => f.id === id);
    if (!fragmentToDelete) {
      return false;
    }

    // Prevent deletion of built-in fragments
    if (fragmentToDelete.isBuiltIn) {
      throw new Error("Cannot delete built-in fragments");
    }

    const updatedFragments = fragments.filter(f => f.id !== id);
    await saveFragments(updatedFragments);
    
    return true;
  }, [fragments, saveFragments]);

  /**
   * Get fragment by ID
   */
  const getFragmentById = useCallback((id: number): MarkdownFragment | undefined => {
    return fragments.find(f => f.id === id);
  }, [fragments]);

  /**
   * Get fragments by category
   */
  const getFragmentsByCategory = useCallback((category: MarkdownFragment['category']): MarkdownFragment[] => {
    return fragments.filter(f => f.category === category);
  }, [fragments]);

  // Initialize built-in fragments on mount if needed
  useEffect(() => {
    initializeBuiltInFragments();
  }, [initializeBuiltInFragments]);

  // Context value
  const contextValue = {
    fragments,
    updateFragments,
    addFragment,
    updateFragment,
    deleteFragment,
    getFragmentById,
    getFragmentsByCategory,
    initializeBuiltInFragments,
  };

  return (
    <FragmentsContext.Provider value={contextValue}>
      {children}
    </FragmentsContext.Provider>
  );
};