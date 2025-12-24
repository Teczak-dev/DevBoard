import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

/**
 * useTheme - Custom hook for accessing theme management functionality
 *
 * This hook provides a convenient way for components to access the global
 * theme state and theme switching functionality from the ThemeProvider context.
 *
 * Features:
 * - Access to current theme setting (light, dark, or system)
 * - Theme toggle/change function with persistence
 * - Automatic error handling for context availability
 * - Type-safe interface to theme management
 *
 * The hook acts as a bridge between components and the ThemeProvider,
 * ensuring that all theme-related operations go through the centralized
 * theme management system with proper persistence and system integration.
 *
 * @returns {ThemeContextType} Object containing current theme and toggle function
 * @throws {Error} If used outside of ThemeProvider context
 *
 * Usage examples:
 * ```typescript
 * // Basic theme access
 * function Header() {
 *   const { theme } = useTheme();
 *   return <div className={`header theme-${theme}`}>Header</div>;
 * }
 *
 * // Theme switching component
 * function ThemeToggle() {
 *   const { theme, toggleTheme } = useTheme();
 *
 *   const handleThemeChange = () => {
 *     const nextTheme = theme === 'light' ? 'dark' : 'light';
 *     toggleTheme(nextTheme);
 *   };
 *
 *   return (
 *     <button onClick={handleThemeChange}>
 *       Current: {theme} (Click to toggle)
 *     </button>
 *   );
 * }
 *
 * // System theme detection
 * function ThemeSelector() {
 *   const { theme, toggleTheme } = useTheme();
 *
 *   return (
 *     <select
 *       value={theme}
 *       onChange={(e) => toggleTheme(e.target.value as Theme)}
 *     >
 *       <option value="light">Light</option>
 *       <option value="dark">Dark</option>
 *       <option value="system">System</option>
 *     </select>
 *   );
 * }
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  /**
   * Ensure the hook is used within the correct provider
   *
   * This check prevents runtime errors by ensuring components that use
   * this hook are properly wrapped with ThemeProvider. The error
   * message provides clear guidance for developers on how to fix the issue.
   *
   * Common causes of this error:
   * - Component is rendered outside the ThemeProvider tree
   * - ThemeProvider is not imported/used in the app root
   * - Hook is called during server-side rendering without proper setup
   */
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
