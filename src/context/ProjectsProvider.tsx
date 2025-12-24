import React, { useMemo } from "react";
import { ProjectsContext } from "./ProjectsContext";
import type { Project } from "../shared/types/project";
import { useDevBoardStorage } from "../shared/hooks/useDevBoardStorage";

/**
 * ProjectsProvider - Global project management component
 *
 * This provider manages the application's project state and provides CRUD operations:
 * - Loading projects from persistent storage
 * - Adding new projects with auto-generated IDs
 * - Updating existing projects
 * - Deleting projects
 * - Bulk project updates
 *
 * The provider integrates with the DevBoard storage system to ensure all project
 * changes are persisted automatically. All operations are asynchronous and include
 * error handling to prevent data loss.
 */
export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: store, update } = useDevBoardStorage();

  /**
   * Memoized projects array from storage
   * Uses useMemo to prevent unnecessary re-renders when store reference changes
   * but projects array content remains the same
   */
  const projects: Project[] = useMemo(() => {
    return store?.projects ?? [];
  }, [store?.projects]);

  /**
   * Replace all projects with a new array
   * @param value - New array of projects to replace current projects
   *
   * This is useful for bulk operations like importing projects or resetting
   * the entire project list. Includes error handling to prevent data corruption.
   */
  const updateProjects = (value: Project[]) => {
    if (!update) return;
    update((prev) => ({ ...prev, projects: value })).catch(console.error);
  };

  /**
   * Update a specific project by ID
   * @param id - The ID of the project to update
   * @param project - The updated project object
   *
   * Finds and replaces the project with matching ID while preserving
   * all other projects in the array. Non-destructive operation.
   */
  const updateProject = (id: number, project: Project) => {
    if (!update) return;
    update((prev) => {
      const nextProjects = prev.projects.map((p) =>
        p.id === id ? project : p,
      );
      return { ...prev, projects: nextProjects };
    }).catch(console.error);
  };

  /**
   * Add a new project to the collection
   * @param project - The project object to add (without ID)
   *
   * Automatically generates a new unique ID by finding the maximum existing ID
   * and incrementing by 1. Handles the case when no projects exist (starts at ID 1).
   * Appends the new project to the end of the projects array.
   */
  const addProject = (project: Project) => {
    if (!update) return;
    update((prev) => {
      // Find the highest existing ID to generate a unique new ID
      const maxId = prev.projects.length
        ? Math.max(...prev.projects.map((p) => p.id))
        : 0;

      // Create new project with auto-generated ID
      const newProject = { ...project, id: maxId + 1 };

      // Add to end of projects array
      return { ...prev, projects: [...prev.projects, newProject] };
    }).catch(console.error);
  };

  /**
   * Delete a project by ID
   * @param id - The ID of the project to remove
   *
   * Filters out the project with matching ID from the projects array.
   * This is a permanent deletion operation - the project data will be lost.
   */
  const deleteProject = (id: number) => {
    if (!update) return;
    update((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    })).catch(console.error);
  };

  // Provide project state and all CRUD operations to child components
  return (
    <ProjectsContext.Provider
      value={{
        projects,
        updateProjects,
        updateProject,
        addProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export default ProjectsProvider;
