/**
 * DevBoard - Main storage management hook
 *
 * This hook provides a React-friendly interface to the DevBoard storage system.
 * Handles both web (localStorage) and Tauri (file system) environments.
 *
 * Features:
 * - Automatic initialization with default data on first run
 * - Loading state management during async operations
 * - Error handling with fallback to default state
 * - Optimistic updates for responsive UI
 * - Automatic state recovery on errors
 *
 * The hook abstracts away the complexity of storage operations and provides
 * a simple, consistent API for components to read and write persistent data.
 */

import { useEffect, useState, useCallback } from "react";
import { storage } from "../utils/storage";
import { type DevBoardStore } from "../types/DevBoardStorage";
import { DEVBOARD_INITIAL_STATE } from "../constants/devboardInitial";
import { isTauri, isTauriReady } from "../utils/isTauri";

/**
 * Interface for the object returned by the hook
 */
interface UseDevBoardStorageReturn {
  /** Current storage data (null during loading) */
  data: DevBoardStore | null;
  /** Loading state - true during initialization and critical operations */
  loading: boolean;
  /** Error message if something goes wrong, null otherwise */
  error: string | null;
  /** Function to update data with optimistic changes */
  update: (updater: (prev: DevBoardStore) => DevBoardStore) => Promise<void>;
  /** Function to reset storage to initial state */
  reset: () => Promise<void>;
}

/**
 * Hook for managing DevBoard storage
 *
 * @returns Object with data, loading state and management functions
 *
 * Usage example:
 * ```typescript
 * function MyComponent() {
 *   const { data, loading, error, update } = useDevBoardStorage();
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   const addProject = (newProject) => {
 *     update(prev => ({
 *       ...prev,
 *       projects: [...prev.projects, newProject]
 *     }));
 *   };
 *
 *   return <div>{data?.projects.length} projects</div>;
 * }
 * ```
 */
export function useDevBoardStorage(): UseDevBoardStorageReturn {
  // Current data state - null during initial loading
  const [data, setData] = useState<DevBoardStore | null>(null);

  // Loading state - true during initialization and critical operations
  const [loading, setLoading] = useState(true);

  // Error state - contains error message if something goes wrong
  const [error, setError] = useState<string | null>(null);

  /**
   * Waits for Tauri APIs to be ready if necessary
   *
   * In Tauri environment, APIs might not be immediately available after app startup.
   * This function waits with timeout for them to load.
   *
   * @returns Promise that resolves when APIs are ready or timeout expires
   */
  const waitForTauriIfNeeded = async (): Promise<void> => {
    if (!isTauri()) {
      // Not in Tauri - no need to wait
      return;
    }

    const TIMEOUT_MS = 5000; // 5 seconds
    const POLL_INTERVAL_MS = 100; // Check every 100ms
    const maxAttempts = TIMEOUT_MS / POLL_INTERVAL_MS;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (await isTauriReady()) {
        console.log(
          "✅ Tauri APIs ready after",
          attempt * POLL_INTERVAL_MS,
          "ms",
        );
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    console.warn(
      "⚠️ Tauri APIs not ready after timeout, falling back to localStorage",
    );
  };

  /**
   * Initialize storage on first hook mount
   *
   * Effect runs once during component mount and:
   * 1. Waits for Tauri APIs to be ready (if necessary)
   * 2. Initializes storage with default data if it doesn't exist
   * 3. Loads existing data from storage
   * 4. Falls back to default state if loading fails
   * 5. Ends loading state
   *
   * Initialization is crucial for first-time app usage and ensures
   * storage always has valid data structure.
   */
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        // Wait for Tauri APIs if needed
        await waitForTauriIfNeeded();

        // Initialize storage with default data if empty
        await storage.init<DevBoardStore>(DEVBOARD_INITIAL_STATE);

        // Load existing data
        const storedData = await storage.get<DevBoardStore>();

        // Set loaded data or fallback to initial state
        setData(storedData || DEVBOARD_INITIAL_STATE);
        setError(null); // Clear previous errors

        console.log("✅ Storage initialized successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("❌ Storage initialization error:", err);

        setError(`Failed to load data: ${errorMessage}`);

        // Even if storage fails, provide working state for the app
        setData(DEVBOARD_INITIAL_STATE);
      } finally {
        // Always end loading state, even on error
        setLoading(false);
      }
    };

    initializeStorage();
  }, []); // Empty dependency array - run only on mount

  /**
   * Update function with optimistic updates and error recovery
   *
   * @param updater - Function that receives current state and returns new state
   * @returns Promise that resolves when storage write is complete
   *
   * Implements optimistic updates for better UX:
   * 1. Immediately updates local state (optimistic update)
   * 2. Persists changes to storage
   * 3. On error, reverts to actual storage state
   *
   * The optimistic approach means users see changes instantly,
   * while error recovery ensures data consistency.
   */
  const update = useCallback(
    async (updater: (prev: DevBoardStore) => DevBoardStore) => {
      // Guard against calling update before data is loaded
      if (!data) {
        console.warn("⚠️ Attempted update before data is loaded");
        return;
      }

      try {
        // Calculate new state using the updater function
        const newData = updater(data);

        // Immediately update local state (optimistic update)
        // Makes UI feel responsive even if storage is slow
        setData(newData);

        // Persist changes to storage
        await storage.set(newData);

        console.log("✅ Data updated successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("❌ Storage update error:", err);

        // Revert to actual storage state to maintain consistency
        // Prevents UI from showing unsaved changes
        try {
          const currentData = await storage.get<DevBoardStore>();
          setData(currentData || DEVBOARD_INITIAL_STATE);
        } catch {
          // If even reading fails, use initial state
          setData(DEVBOARD_INITIAL_STATE);
        }

        // Re-throw error so callers can handle it
        throw new Error(`Failed to update data: ${errorMessage}`);
      }
    },
    [data], // Recreate callback when data changes
  );

  /**
   * Resets storage to initial/default state
   *
   * @returns Promise that resolves when reset is complete
   *
   * This function completely resets application data to factory defaults.
   * Useful for user logout, app reset, or troubleshooting corrupted data.
   *
   * The operation is atomic - both local state and persistent storage
   * are updated together to prevent inconsistencies.
   */
  const reset = useCallback(async () => {
    try {
      // Update local state first
      setData(DEVBOARD_INITIAL_STATE);

      // Then persist reset to storage
      await storage.set(DEVBOARD_INITIAL_STATE);

      console.log("✅ Storage reset to initial state");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("❌ Storage reset error:", err);

      // Re-throw so callers know reset failed
      throw new Error(`Failed to reset data: ${errorMessage}`);
    }
  }, []); // No dependencies - reset logic is static

  // Return complete storage interface
  return {
    data,
    loading,
    error,
    update,
    reset,
  };
}
