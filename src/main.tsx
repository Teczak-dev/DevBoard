import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { ThemeProvider } from "./context/ThemeProvider";
import { ProjectsProvider } from "./context/ProjectsProvider";
import "./index.css";

/**
 * DevBoard - Main application entry point
 *
 * This file initializes the entire React application with all necessary providers
 * and configuration for both Tauri and Web environments.
 *
 * Application structure:
 * - React in Strict Mode (better error detection)
 * - Router for navigation between pages
 * - ThemeProvider for theme management
 * - ProjectsProvider for project state management
 *
 * The application automatically detects whether it's running in Tauri or browser
 * environment and configures functionality accordingly.
 */

/**
 * Initialize Tauri APIs (desktop environment only)
 *
 * Loads Tauri APIs asynchronously to ensure they're available before
 * rendering the application. Skipped in web environment.
 */
async function initializeTauriAPIs(): Promise<void> {
  // Check if application is running in Tauri environment
  const isTauriEnvironment =
    typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

  if (isTauriEnvironment) {
    try {
      // Load file system and path APIs
      await import("@tauri-apps/plugin-fs");
      await import("@tauri-apps/api/path");
      console.log("✅ Tauri APIs loaded successfully");
    } catch (error) {
      console.warn("⚠️ Failed to load Tauri APIs:", error);
    }
  }
}

/**
 * Renders the main application with all providers
 */
function renderApp(): void {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Root element not found in DOM");
  }

  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <ProjectsProvider>
            <AppRoutes />
          </ProjectsProvider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>,
  );
}

/**
 * Application startup
 *
 * In Tauri environment: wait for APIs to load before rendering
 * In browser: render immediately
 */
const isTauriEnvironment =
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

if (isTauriEnvironment) {
  // Tauri environment - wait for APIs
  initializeTauriAPIs().then(() => {
    renderApp();
  });
} else {
  // Web environment - render immediately
  renderApp();
}
