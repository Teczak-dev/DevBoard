/**
 * ProjectsContext - Type definitions for project management context
 * 
 * This module defines the TypeScript interfaces for the projects context,
 * providing type safety for all project-related operations throughout the app.
 * 
 * All CRUD operations are asynchronous to support both localStorage (web)
 * and file system (Tauri) storage backends with consistent API.
 * 
 * The context provides:
 * - Read access to projects array
 * - Async CRUD operations with error handling
 * - Bulk operations for project management
 * - Type-safe interfaces for all operations
 */

import { createContext } from "react";
import type { Project } from "../shared/types/project";

/**
 * Interface defining the complete projects context API
 * All mutation operations are async to support persistent storage
 */
export interface ProjectsContextType {
  /** Current array of all projects */
  projects: Project[];
  
  /** Replace entire projects array (bulk operation) */
  updateProjects: (value: Project[]) => Promise<void>;
  
  /** Update a single project by ID */
  updateProject: (id: number, project: Project) => Promise<void>;
  
  /** Add a new project (ID will be auto-generated) */
  addProject: (project: Project) => Promise<void>;
  
  /** Delete a project by ID (permanent operation) */
  deleteProject: (id: number) => Promise<void>;
}

/**
 * React context for project management
 * Provides null as default to enforce proper provider usage
 */
export const ProjectsContext = createContext<ProjectsContextType | null>(null);
