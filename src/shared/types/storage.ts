/**
 * DevBoard - Storage adapter interface
 *
 * Defines a universal interface for different data storage methods.
 * Allows easy switching between localStorage (browser) and file system
 * (Tauri desktop) without changing application logic.
 *
 * All methods are asynchronous for compatibility with different
 * storage backends.
 */
export interface StorageAdapter {
  /**
   * Retrieves data from storage
   * @param key - Key identifying the data
   * @returns Promise with data of type T or null if not found
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Saves data to storage
   * @param key - Key under which to save the data
   * @param value - Data to save (must be JSON serializable)
   * @returns Promise that resolves when save is complete
   */
  set<T>(key: string, value: T): Promise<void>;

  /**
   * Removes data from storage
   * @param key - Key of data to remove
   * @returns Promise that resolves when removal is complete
   */
  remove(key: string): Promise<void>;
}
