/**
 * DevBoard - Initial application state
 *
 * This file defines default data that is used on first application startup
 * or when storage is empty/corrupted.
 *
 * Initial structure contains:
 * - Empty lists for all main sections (projects, snippets, todos)
 * - Default settings (dark theme)
 * - Version metadata for future data migrations
 *
 * This data is automatically saved to storage during first initialization
 * and serves as fallback in case of problems loading user data.
 */

import type { DevBoardStore } from "../types/DevBoardStorage";

/**
 * Initial state of all DevBoard application data
 *
 * Used when:
 * - Application starts for the first time
 * - Storage is empty or corrupted
 * - User resets application to factory settings
 * - Error occurs while loading user data
 *
 * @constant
 */
export const DEVBOARD_INITIAL_STATE: DevBoardStore = {
  /** List of projects - initially empty */
  projects: [],

  /** Code snippets - initially empty */
  snippets: [],

  /** List of tasks - initially empty */
  todos: [],

  /** Application settings */
  settings: {
    /** Default theme: dark (better for developers) */
    theme: "dark",
  },

  /** Metadata about data structure */
  meta: {
    /** Data format version - used for future migrations */
    version: 1,
  },
};
