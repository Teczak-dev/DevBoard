/**
 * DevBoard - Tauri storage adapter
 *
 * This module implements data storage in the file system for Tauri desktop applications.
 * It uses file system APIs to read/write JSON data to the application data directory.
 *
 * Key features:
 * - Cross-platform support (Windows, macOS, Linux)
 * - Automatic application data directory detection
 * - Safe error handling
 * - JSON serialization/deserialization
 */

import type { StorageAdapter } from "../types/storage";
import { isTauriReady } from "./isTauri";

/**
 * Generates the full file path for a given storage key
 *
 * @param key - Storage identifier (becomes filename)
 * @returns Promise with file path
 *
 * Tries to get platform-specific application data directory,
 * falls back to simple relative path if that fails.
 */
const getFilePath = async (key: string): Promise<string> => {
  try {
    // Import and use Tauri's appDataDir function to get app data directory
    const { appDataDir } = await import("@tauri-apps/api/path");
    const appDir = await appDataDir();

    // Normalize path (replace backslashes with forward slashes)
    const normalizedDir = appDir.replace(/\\/g, "/");
    return `${normalizedDir}/${key}.json`;
  } catch (error) {
    console.warn("⚠️ Failed to get app data directory:", error);
    // Fallback to simple relative path
    return `${key}.json`;
  }
};

/**
 * Checks if Tauri APIs are available by delegating to shared helper
 *
 * This delegates to `isTauriReady()` from the shared detection util so that
 * detection logic is centralized and we avoid checking internal globals
 * directly in multiple places.
 */
const isTauriApiAvailable = isTauriReady;

/**
 * Tauri file system storage adapter
 *
 * Implements the StorageAdapter interface using Tauri's file system APIs.
 * Provides persistent storage through JSON file read/write operations.
 */
export const tauriStorage: StorageAdapter = {
  /**
   * Retrieves data from storage file
   *
   * @template T - Expected type of stored data
   * @param key - Storage key (filename)
   * @returns Promise with data or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      // Check API availability
      if (!(await isTauriApiAvailable())) {
        return null;
      }

      // Load file system API
      const { exists, readTextFile } = await import("@tauri-apps/plugin-fs");

      // Get file path
      const filePath = await getFilePath(key);

      // Check if file exists
      if (!(await exists(filePath))) {
        console.log(`📂 File ${filePath} does not exist`);
        return null;
      }

      // Read and parse content
      const content = await readTextFile(filePath);
      const data = content ? JSON.parse(content) : null;

      console.log(`✅ Data read from ${filePath}`);
      return data;
    } catch (error) {
      console.warn("⚠️ Error reading from file:", error);
      return null;
    }
  },

  /**
   * Saves data to storage file
   *
   * @template T - Type of data being saved
   * @param key - Storage key (filename)
   * @param value - Data to save
   * @returns Promise that resolves when write is complete
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      // Check API availability
      if (!(await isTauriApiAvailable())) {
        throw new Error("Tauri APIs not available");
      }

      // Load file system API
      const { writeTextFile, mkdir } = await import("@tauri-apps/plugin-fs");

      // Get file path
      const filePath = await getFilePath(key);

      // Create directory if path contains folder
      if (filePath.includes("/")) {
        const dirPath = filePath.substring(0, filePath.lastIndexOf("/"));
        try {
          await mkdir(dirPath, { recursive: true });
        } catch (mkdirError) {
          // Directory might already exist - continue
          console.debug("ℹ️ Directory info:", mkdirError);
        }
      }

      // Serialize data to JSON with indentation for readability
      const content = JSON.stringify(value, null, 2);

      // Write to file
      await writeTextFile(filePath, content);
      console.log(`✅ Data saved to ${filePath}`);
    } catch (error) {
      console.error("❌ Error writing to file:", error);
      throw error;
    }
  },

  /**
   * Removes storage file
   *
   * @param key - Storage key (filename to delete)
   * @returns Promise that resolves when removal is complete
   */
  async remove(key: string): Promise<void> {
    try {
      // Check API availability
      if (!(await isTauriApiAvailable())) {
        console.log("⚠️ Tauri APIs unavailable - skipping removal");
        return;
      }

      // Load file system API
      const { exists, remove } = await import("@tauri-apps/plugin-fs");

      // Get file path
      const filePath = await getFilePath(key);

      // Remove file only if it exists
      if (await exists(filePath)) {
        await remove(filePath);
        console.log(`🗑️ File ${filePath} removed`);
      } else {
        console.log(`ℹ️ File ${filePath} does not exist - nothing to remove`);
      }
    } catch (error) {
      // Removal errors are ignored - the goal (data removal) is still achieved
      console.warn("⚠️ Error removing file:", error);
    }
  },
};
