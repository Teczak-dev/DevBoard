/**
 * DevBoard - Tauri environment detection
 *
 * This file contains utility functions to detect whether the application is running
 * in a Tauri (desktop) environment or a regular web browser.
 *
 * Tauri injects special objects into the window when the application runs
 * in desktop environment, which allows us to detect the execution context.
 */

/**
 * Checks if the application is running in Tauri environment
 *
 * @returns true if Tauri environment, false if browser
 *
 * Detects the presence of __TAURI_INTERNALS__ object which is automatically
 * injected by Tauri runtime into the global window object.
 *
 * Usage example:
 * ```typescript
 * if (isTauri()) {
 *   // Code specific for desktop application
 *   console.log('Application running as desktop app');
 * } else {
 *   // Code for browser
 *   console.log('Application running in browser');
 * }
 * ```
 */
export const isTauri = (): boolean => {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
};

/**
 * Checks if Tauri APIs are fully loaded and ready for use
 *
 * @returns Promise<boolean> - true if APIs are available, false otherwise
 *
 * This function performs a more comprehensive check than isTauri():
 * 1. Checks if we're in Tauri environment
 * 2. Tries to load required APIs (fs, path)
 * 3. Returns true only when all APIs are available
 *
 * Use this function before attempting to use Tauri functions to avoid errors.
 *
 * Usage example:
 * ```typescript
 * if (await isTauriReady()) {
 *   // Safely use Tauri APIs
 *   await saveToFile(data);
 * } else {
 *   // Use alternative method (e.g. localStorage)
 *   localStorage.setItem('data', JSON.stringify(data));
 * }
 * ```
 */
export const isTauriReady = async (): Promise<boolean> => {
  // First check if we're in Tauri environment at all
  if (!isTauri()) {
    return false;
  }

  try {
    // Try to load required Tauri APIs
    await import("@tauri-apps/plugin-fs");
    await import("@tauri-apps/api/path");
    return true;
  } catch (error) {
    // APIs are not available - probably configuration issue
    console.warn("⚠️ Tauri APIs not available:", error);
    return false;
  }
};
