import React, { useState, useEffect } from "react";
import { ThemeContext, type Theme } from "./ThemeContext";
import { useDevBoardStorage } from "../shared/hooks/useDevBoardStorage";

/**
 * ThemeProvider - Global theme management component
 *
 * This provider manages the application's theme state (light/dark/system) and handles:
 * - Theme persistence to storage
 * - Automatic system theme detection when in "system" mode
 * - DOM attribute updates for CSS theme switching
 * - Prevention of update loops that could cause infinite re-renders
 *
 * The provider integrates with the DevBoard storage system to persist user preferences
 * while being careful to avoid state synchronization cycles.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: store, update } = useDevBoardStorage();

  // Initialize theme with store value or default to "system"
  // This reads the saved theme preference from persistent storage
  const [theme, setTheme] = useState<Theme>(() => {
    return store?.settings?.theme || "system";
  });

  /**
   * Get the current system color scheme preference
   * Uses the browser's matchMedia API to detect if user prefers dark mode
   * Falls back to "light" if window or matchMedia is unavailable (SSR safety)
   */
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window === "undefined" || !window.matchMedia) return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  /**
   * Apply the current theme to the document root
   * Sets the data-theme attribute on html element for CSS theme switching
   * When theme is "system", it resolves to actual light/dark based on OS preference
   */
  useEffect(() => {
    const effectiveTheme = theme === "system" ? getSystemTheme() : theme;
    document.documentElement.setAttribute("data-theme", effectiveTheme);
  }, [theme]);

  /**
   * Listen for system theme changes when in "system" mode
   * This allows the app to automatically switch themes when user changes
   * their OS dark/light mode preference while the app is running
   */
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const effectiveTheme = mediaQuery.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", effectiveTheme);
    };

    // Add listener for system theme changes
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup listener on unmount or when theme changes away from "system"
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  /**
   * Toggle/change the current theme
   * @param newTheme - The new theme to apply ("light", "dark", or "system")
   *
   * This function:
   * - Updates local state immediately for responsive UI
   * - Persists explicit themes (light/dark) to storage
   * - Does NOT persist "system" mode to avoid conflicts with auto-detection
   * - Includes error handling for storage failures
   */
  const toggleTheme = async (newTheme: Theme) => {
    // Avoid unnecessary updates if theme hasn't changed
    if (newTheme === theme) return;

    // Update local state immediately (optimistic update)
    setTheme(newTheme);

    // Only persist explicit themes (not "system") to prevent storage conflicts
    // System mode should always resolve dynamically from OS preferences
    if (newTheme !== "system" && update) {
      try {
        await update((prev) => ({
          ...prev,
          settings: {
            ...prev.settings,
            theme: newTheme as "light" | "dark",
          },
        }));
      } catch (error) {
        console.error("Failed to save theme:", error);
        // Note: We don't revert the UI state here as the change is still valid
        // The next app restart will load from storage and may differ from UI
      }
    }
  };

  // Provide theme state and toggle function to all child components
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
