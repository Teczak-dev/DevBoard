import { useContext } from "react";
import { ProjectsContext } from "../../context/ProjectsContext";

/**
 * useProjects - Custom hook for accessing project management functionality
 *
 * This hook provides a convenient way for components to access the global
 * project state and management functions from the ProjectsProvider context.
 *
 * Features:
 * - Access to current projects array
 * - CRUD operations (create, read, update, delete) for projects
 * - Automatic error handling for context availability
 * - Type-safe interface to project management
 *
 * The hook acts as a bridge between components and the ProjectsProvider,
 * ensuring that all project-related operations go through the centralized
 * state management system with proper persistence.
 *
 * @returns {ProjectsContextType} Object containing projects array and management functions
 * @throws {Error} If used outside of ProjectsProvider context
 *
 * Usage example:
 * ```typescript
 * function ProjectList() {
 *   const { projects, addProject, deleteProject } = useProjects();
 *
 *   const handleAddProject = () => {
 *     addProject({
 *       name: "New Project",
 *       description: "Project description"
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       {projects.map(project => (
 *         <div key={project.id}>{project.name}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useProjects() {
  const context = useContext(ProjectsContext);

  /**
   * Ensure the hook is used within the correct provider
   *
   * This check prevents runtime errors by ensuring components that use
   * this hook are properly wrapped with ProjectsProvider. The error
   * message provides clear guidance for developers on how to fix the issue.
   */
  if (!context) {
    throw new Error("useProjects must be used within ProjectsProvider");
  }

  return context;
}
