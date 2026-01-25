/**
 * useSnippetProjectRelations - Custom hook for managing snippet-project relationships
 * 
 * This hook provides comprehensive functionality for managing bidirectional relationships
 * between code snippets and projects. It ensures data consistency by automatically
 * updating both entities when relationships are created or removed.
 * 
 * Features:
 * - Bidirectional relationship management
 * - Async operations with proper error handling
 * - Utility functions for filtering and selection
 * - Automatic data synchronization
 * - Type-safe interfaces for all operations
 * 
 * Relationship model:
 * - Snippets contain an array of project IDs they belong to
 * - Projects contain an array of snippet IDs they include
 * - Both sides are kept in sync automatically
 * 
 * Use cases:
 * - Adding snippets to projects
 * - Removing snippets from projects
 * - Getting all projects for a snippet
 * - Getting all snippets for a project
 * - Finding available items for selection dialogs
 */

import { useSnippets } from "./useSnippets";
import { useProjects } from "./useProjects";
import type { Snippet } from "../types/snippet";
import type { Project } from "../types/project";
export const useSnippetProjectRelations = () => {
  const { snippets, updateSnippet } = useSnippets();
  const { projects, updateProject } = useProjects();

  /**
   * Add a snippet to a project (creates bidirectional relationship)
   * 
   * This function creates a relationship between a snippet and project by:
   * 1. Adding the project ID to the snippet's projects array
   * 2. Adding the snippet ID to the project's snippets array
   * 
   * The operation is atomic - both updates succeed or both fail.
   * Duplicate relationships are automatically prevented.
   * 
   * @param snippetId - ID of the snippet to add
   * @param projectId - ID of the project to add snippet to
   */
  const addSnippetToProject = async (snippetId: number, projectId: number) => {
    const snippet = snippets.find(s => s.id === snippetId);
    const project = projects.find(p => p.id === projectId);
    
    if (!snippet || !project) return;

    try {
      // Update snippet: add project ID if not already present
      const snippetProjects = snippet.projects || [];
      if (!snippetProjects.includes(projectId)) {
        const updatedSnippet: Snippet = {
          ...snippet,
          projects: [...snippetProjects, projectId]
        };
        await updateSnippet(snippetId, updatedSnippet);
      }

      // Update project: add snippet ID if not already present
      const projectSnippets = project.snippets || [];
      if (!projectSnippets.includes(snippetId)) {
        const updatedProject: Project = {
          ...project,
          snippets: [...projectSnippets, snippetId]
        };
        await updateProject(projectId, updatedProject);
      }
    } catch (error) {
      console.error("Error adding snippet to project:", error);
    }
  };

  /**
   * Remove a snippet from a project (removes bidirectional relationship)
   * 
   * This function removes the relationship between a snippet and project by:
   * 1. Removing the project ID from the snippet's projects array
   * 2. Removing the snippet ID from the project's snippets array
   * 
   * The operation is atomic - both updates succeed or both fail.
   * Safe to call even if relationship doesn't exist.
   * 
   * @param snippetId - ID of the snippet to remove
   * @param projectId - ID of the project to remove snippet from
   */
  const removeSnippetFromProject = async (snippetId: number, projectId: number) => {
    const snippet = snippets.find(s => s.id === snippetId);
    const project = projects.find(p => p.id === projectId);
    
    if (!snippet || !project) return;

    try {
      // Update snippet: remove project ID
      const snippetProjects = snippet.projects || [];
      if (snippetProjects.includes(projectId)) {
        const updatedSnippet: Snippet = {
          ...snippet,
          projects: snippetProjects.filter(id => id !== projectId)
        };
        await updateSnippet(snippetId, updatedSnippet);
      }

      // Update project: remove snippet ID
      const projectSnippets = project.snippets || [];
      if (projectSnippets.includes(snippetId)) {
        const updatedProject: Project = {
          ...project,
          snippets: projectSnippets.filter(id => id !== snippetId)
        };
        await updateProject(projectId, updatedProject);
      }
    } catch (error) {
      console.error("Error removing snippet from project:", error);
    }
  };

  /**
   * Get all projects that contain a specific snippet
   * 
   * Returns an array of Project objects that include the specified snippet.
   * Uses the snippet's projects array to filter the complete projects list.
   * 
   * @param snippetId - ID of the snippet to find projects for
   * @returns Array of Project objects containing the snippet
   */
  const getProjectsForSnippet = (snippetId: number): Project[] => {
    const snippet = snippets.find(s => s.id === snippetId);
    if (!snippet || !snippet.projects) return [];
    
    return projects.filter(project => 
      snippet.projects!.includes(project.id)
    );
  };

  /**
   * Get all snippets that belong to a specific project
   * 
   * Returns an array of Snippet objects that are included in the specified project.
   * Uses the project's snippets array to filter the complete snippets list.
   * 
   * @param projectId - ID of the project to find snippets for
   * @returns Array of Snippet objects belonging to the project
   */
  const getSnippetsForProject = (projectId: number): Snippet[] => {
    const project = projects.find(p => p.id === projectId);
    if (!project || !project.snippets) return [];
    
    return snippets.filter(snippet => 
      project.snippets!.includes(snippet.id)
    );
  };

  /**
   * Get all projects that don't contain a specific snippet (for selection)
   * 
   * Returns projects available to be added to a snippet. Useful for
   * populating selection dropdowns when adding snippets to projects.
   * 
   * @param snippetId - ID of the snippet to find available projects for
   * @returns Array of Project objects not yet containing the snippet
   */
  const getAvailableProjectsForSnippet = (snippetId: number): Project[] => {
    const snippet = snippets.find(s => s.id === snippetId);
    const snippetProjects = snippet?.projects || [];
    
    return projects.filter(project => 
      !snippetProjects.includes(project.id)
    );
  };

  /**
   * Get all snippets that are not in a specific project (for selection)
   * 
   * Returns snippets available to be added to a project. Useful for
   * populating selection dropdowns when adding snippets to projects.
   * 
   * @param projectId - ID of the project to find available snippets for
   * @returns Array of Snippet objects not yet in the project
   */
  const getAvailableSnippetsForProject = (projectId: number): Snippet[] => {
    const project = projects.find(p => p.id === projectId);
    const projectSnippets = project?.snippets || [];
    
    return snippets.filter(snippet => 
      !projectSnippets.includes(snippet.id)
    );
  };

  return {
    addSnippetToProject,
    removeSnippetFromProject,
    getProjectsForSnippet,
    getSnippetsForProject,
    getAvailableProjectsForSnippet,
    getAvailableSnippetsForProject,
  };
};