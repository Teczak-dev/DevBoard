/**
 * DevBoard - TypeScript declarations for Tauri APIs
 *
 * This file defines types for Tauri APIs that are injected into the window object
 * in desktop environment. This allows TypeScript to properly type-check
 * Tauri function usage throughout the application.
 *
 * Tauri injects its APIs into the global window object when the application
 * runs in desktop environment (webview). These APIs don't exist in browser.
 */

declare global {
  interface Window {
    /**
     * Note: internal implementation markers have been removed from the
     * TypeScript declarations. Prefer using the public `__TAURI__` global
     * object for feature detection and runtime APIs.
     */

    /**
     * Main Tauri API with access to operating system functions
     */
    __TAURI__?: {
      /** File system API */
      fs?: {
        /** Checks if file exists */
        exists?: (path: string) => Promise<boolean>;

        /** Reads text file content */
        readTextFile?: (path: string) => Promise<string>;

        /** Legacy API for reading files */
        readFile?: (path: string) => Promise<string>;

        /** Writes text to file */
        writeTextFile?: (path: string, content: string) => Promise<void>;

        /** Alternative write API with options */
        writeFile?: (options: {
          path: string;
          contents: string;
        }) => Promise<void>;

        /** Removes file */
        removeFile?: (path: string) => Promise<void>;

        /** Legacy removal API */
        remove?: (path: string) => Promise<void>;
      };

      /** System paths API */
      path?: {
        /** Returns path to application data directory */
        appDataDir?: () => Promise<string>;
      };
    };
  }
}

// Export empty object to make this file a module
export {};
