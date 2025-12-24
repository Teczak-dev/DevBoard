import type { Project } from "./project";
import type { Snippet } from "./snippet";
import type { Todo } from "./todo";

/**
 * DevBoard - Main application data type
 *
 * Defines the structure of all data stored by the application.
 * This is the main object saved to storage (localStorage or file in Tauri).
 *
 * Structure:
 * - projects: list of all user projects
 * - snippets: reusable code fragments
 * - todos: tasks to be completed in projects
 * - settings: application settings (theme, preferences)
 * - meta: metadata about version and data structure
 */
export type DevBoardStore = {
  /** List of user projects */
  projects: Project[];

  /** Reusable code fragments */
  snippets: Snippet[];

  /** List of tasks to complete */
  todos: Todo[];

  /** Application settings */
  settings: {
    /** Color theme: light, dark or automatic */
    theme: "light" | "dark" | "system";
  };

  /** Metadata about data structure */
  meta: {
    /** Data format version (for future migrations) */
    version: number;
  };
};
