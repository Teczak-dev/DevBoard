/**
 * DevBoard - Main data storage system
 *
 * This module provides a unified storage interface that automatically selects
 * the appropriate backend based on the runtime environment:
 * - Tauri (desktop): file system
 * - Browser: localStorage
 *
 * Thanks to this abstraction, the rest of the application can use storage without
 * worrying about platform differences. All operations are asynchronous
 * to maintain consistency between different
 backends.
 */

import { isTauriReady } from "./isTauri";
import { tauriStorage } from "./tauriStorage";

/**
 * Key used to store all DevBoard data in both environments
 * (localStorage and file in Tauri)
 */
const STORAGE_KEY = "devboard";

/**
 * Main storage object for DevBoard application
 *
 * Provides a simple and consistent interface for data persistence
 * regardless of platform (web/desktop).
 */
export const storage = {
  /**
   * Retrieves data from storage
   *
   * @template T - Expected type of stored data
   * @returns Promise with data or null if not found
   *
   * In Tauri: reads from JSON file in application data directory
   * In browser: reads from localStorage and parses JSON
   */
  async get<T>(): Promise<T | null> {
    if (await isTauriReady()) {
      // Tauri environment - use file system
      return await tauriStorage.get<T>(STORAGE_KEY);
    }

    // Web environment - use localStorage
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      return rawData ? JSON.parse(rawData) : null;
    } catch (error) {
      console.warn("⚠️ Error reading from localStorage:", error);
      return null;
    }
  },

  /**
   * Saves data to storage
   *
   * @template T - Type of data being saved
   * @param data - Data to save (must be JSON serializable)
   * @returns Promise that resolves when save is complete
   *
   * In Tauri: writes to JSON file in application data directory
   * In browser: serializes to JSON and stores in localStorage
   */
  async set<T>(data: T): Promise<void> {
    if (await isTauriReady()) {
      // Tauri environment - use file system
      await tauriStorage.set<T>(STORAGE_KEY, data);
    } else {
      // Web environment - use localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error("❌ Error writing to localStorage:", error);
        throw new Error("Failed to save data");
      }
    }
  },

  /**
   * Initializes storage with default data if empty
   *
   * @template T - Type of initial data
   * @param initialData - Default data to save if storage is empty
   * @returns Promise that resolves when initialization is complete
   *
   * This method is safe to call multiple times - it only writes initial
   * data if storage is empty. Used during app startup to ensure
   * storage always contains valid data structure.
   */
  async init<T>(initialData: T): Promise<void> {
    const existingData = await this.get<T>();

    if (!existingData) {
      console.log("📦 Initializing storage with default data");
      await this.set(initialData);
    } else {
      console.log("✅ Storage already contains data");
    }
  },

  /**
   * Clears all stored data
   *
   * @returns Promise that resolves when data is cleared
   *
   * Completely removes all DevBoard data from storage:
   * - In Tauri: deletes the storage file
   * - In browser: removes item from localStorage
   *
   * ⚠️ WARNING: This operation is irreversible - all user data will be lost
   *
   * Useful for:
   * - User logout functionality
   * - Resetting app to factory defaults
   * - Troubleshooting corrupted data
   */
  async clear(): Promise<void> {
    if (await isTauriReady()) {
      // Tauri environment - delete file
      await tauriStorage.remove(STORAGE_KEY);
      console.log("🗑️ Data removed from file system");
    } else {
      // Web environment - clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      console.log("🗑️ Data removed from localStorage");
    }
  },
};
