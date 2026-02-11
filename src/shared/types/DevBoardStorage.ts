import type { Project } from "./project";
import type { Snippet } from "./snippet";
import type { Todo } from "./todo";
import type { MarkdownFragment } from "./fragment";

/**
 * DevBoard - Main application data type
 *
 * Defines the structure of all data stored by the application.
 * This is the main object saved to storage (localStorage or file in Tauri).
 *
 * Structure:
 * - projects: list of all user projects
 * - snippets: reusable code fragments
 * - todos: enhanced tasks with status, colors, and project association
 * - fragments: markdown fragments for the editor
 * - settings: application settings (theme, preferences)
 * - meta: metadata about version and data structure
 */
export type DevBoardStore = {
  /** List of user projects */
  projects: Project[];

  /** Reusable code fragments */
  snippets: Snippet[];

  /** Enhanced tasks with status tracking and project association */
  todos: Todo[];

  /** Markdown editor fragments (built-in and custom) */
  fragments: MarkdownFragment[];

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
