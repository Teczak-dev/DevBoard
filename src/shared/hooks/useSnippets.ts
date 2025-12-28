import { useContext } from "react";
import { SnippetsContext } from "../../context/SnippetsContext";

/**
 * useSnippets - Custom hook for accessing snippets management functionality
 *
 * This hook provides a convenient way for components to access the global
 * snippets state and management functions from the SnippetsProvider context.
 *
 * Features:
 * - Access to current snippets array
 * - CRUD operations (create, read, update, delete) for snippets
 * - Automatic error handling for context availability
 * - Type-safe interface to snippets management
 *
 * The hook acts as a bridge between components and the SnippetsProvider,
 * ensuring that all snippet-related operations go through the centralized
 * state management system with proper persistence.
 *
 * @returns {SnippetsContextType} Object containing snippets array and management functions
 * @throws {Error} If used outside of SnippetsProvider context
 *
 * Usage example:
 * ```typescript
 * function SnippetList() {
 *   const { snippets, addSnippet, deleteSnippet } = useSnippets();
 *
 *   const handleAddSnippet = () => {
 *     addSnippet({
 *       id: Date.now(),
 *       title: "Example",
 *       content: "console.log('hi')"
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       {snippets.map(snippet => (
 *         <div key={snippet.id}>{snippet.title}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSnippets() {
  const context = useContext(SnippetsContext);

  /**
   * Ensure the hook is used within the correct provider
   *
   * This check prevents runtime errors by ensuring components that use
   * this hook are properly wrapped with SnippetsProvider. The error
   * message provides clear guidance for developers on how to fix the issue.
   */
  if (!context) {
    throw new Error("useSnippets must be used within SnippetsProvider");
  }

  return context;
}
