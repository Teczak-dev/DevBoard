/**
 * DevBoard - Tauri environment detection
 *
 * Utility functions to detect whether the application is running in a Tauri
 * (desktop) environment or a regular web browser.
 *
 * Prefer checking the public `window.__TAURI__` object (injected by Tauri)
 * instead of relying on internal implementation details.
 */

/**
 * Checks if the application is running in a Tauri environment.
 *
 * @returns true if Tauri environment, false otherwise
 *
 * This uses the public `window.__TAURI__` global if present. It is safer than
 * checking internal injection points and aligns with the recommended public API.
 */
export const isTauri = (): boolean => {
  return typeof window !== "undefined" && !!window.__TAURI__;
};

/**
 * Checks if Tauri APIs are fully loaded and ready for use.
 *
 * @returns Promise<boolean> - true if APIs are available, false otherwise
 *
 * This function:
 * 1. Verifies we're running in a Tauri environment via `isTauri()`.
 * 2. Attempts to dynamically import the necessary Tauri modules (fs, path).
 * 3. Returns true only if imports succeed.
 *
 * Use this before calling Tauri APIs to avoid runtime errors in browser contexts.
 */
export const isTauriReady = async (): Promise<boolean> => {
  // Ensure we're in a Tauri environment first
  if (!isTauri()) {
    return false;
  }

  try {
    // Try to import essential Tauri APIs
    await import("@tauri-apps/plugin-fs");
    await import("@tauri-apps/api/path");
    return true;
  } catch (error) {
    // Not all APIs available - probably not fully initialized or misconfigured
    console.warn("⚠️ Tauri APIs not available:", error);
    return false;
  }
};
