/**
 * SnippetExpandContext - Context for managing snippet expand/collapse state
 * 
 * This context provides global state management for the expand/collapse functionality
 * of code snippets across the application. It enables users to expand or collapse
 * individual snippets as well as bulk operations (expand all, collapse all).
 * 
 * The context uses a Set to track which snippets are currently expanded by their IDs,
 * providing efficient lookup and update operations for large numbers of snippets.
 * 
 * Features:
 * - Global state for snippet expansion
 * - Efficient Set-based tracking
 * - Fallback handling when used outside provider
 * - TypeScript type safety
 * 
 * Usage:
 * - Wrap components with SnippetExpandContext.Provider
 * - Use useSnippetExpand() hook to access state and setters
 * - Safe to use in components that may be outside the provider
 */

import { createContext, useContext } from 'react';

/**
 * Context for managing expand/collapse state of snippets
 * Uses Set<number> for efficient tracking of expanded snippet IDs
 */
export const SnippetExpandContext = createContext<{
  expandedSnippets: Set<number>;
  setExpandedSnippets: (expanded: Set<number>) => void;
}>({
  expandedSnippets: new Set(),
  setExpandedSnippets: () => {},
});

/**
 * Hook to access snippet expand/collapse functionality
 * 
 * Provides safe access to the context with automatic fallback when used
 * outside of the SnippetExpandContext.Provider. This prevents crashes
 * when components are used in different contexts.
 * 
 * @returns Object with expandedSnippets Set and setExpandedSnippets function
 */
export const useSnippetExpand = () => {
  try {
    return useContext(SnippetExpandContext);
  } catch {
    // Fallback when context is not available
    return {
      expandedSnippets: new Set<number>(),
      setExpandedSnippets: () => {},
    };
  }
};