import { useState } from "react";
import type { Project } from "../types/project";

/**
 * useEditProject - Custom hook for editing existing projects with validation
 *
 * This hook manages the form state and validation logic for editing existing projects.
 * It provides a complete interface for project modification including input validation,
 * error handling, form submission, and project deletion functionality.
 *
 * Features:
 * - Pre-populated form fields with existing project data
 * - Real-time input validation with error messages
 * - Automatic input length limiting to prevent invalid data
 * - Form state management for project name and description
 * - Integration with project update, deletion, and navigation systems
 * - Safe project deletion with navigation to home page
 *
 * Validation rules:
 * - Project name: minimum 1 character, maximum 100 characters
 * - Project description: maximum 350 characters
 *
 * @param project - The existing project object to edit
 * @param updateProject - Function to update the project in the store
 * @param deleteProject - Function to delete the project from the store
 * @param closeEdit - Function to close the edit mode/modal
 * @param navigate - Navigation function to redirect after deletion
 * @returns Object containing form state, handlers, and action functions
 */
export const useEditProject = (
  project: Project,
  updateProject: (id: number, project: Project) => void,
  deleteProject: (id: number) => void,
  closeEdit: () => void,
  navigate: (to: string) => void,
) => {
  // Initialize project name with existing project title
  const [projectName, setProjectName] = useState<string>(project.title);
  const [errorProjectName, setErrorProjectName] = useState<string | null>(null);

  // Initialize project description with existing description (handle undefined)
  const [projectDescription, setProjectDescription] = useState<string>(
    project.description || "",
  );
  const [errorProjectDescription, setErrorProjectDescription] = useState<
    string | null
  >(null);

  /**
   * Validate project name according to business rules
   *
   * @param name - The project name to validate
   * @returns true if valid, false if invalid
   *
   * Validation criteria:
   * - Must be at least 1 character long
   * - Maximum length is enforced by input handlers (100 chars)
   */
  const projectNameValidation = (name: string): boolean => {
    if (name.length < 1) {
      setErrorProjectName("Project name must be at least 1 character long");
      return false;
    } else {
      setErrorProjectName(null);
      return true;
    }
  };

  /**
   * Validate project description according to business rules
   *
   * @param description - The project description to validate
   * @returns true if valid, false if invalid
   *
   * Validation criteria:
   * - Maximum 350 characters allowed
   * - No minimum length requirement (description is optional)
   */
  const projectDescriptionValidation = (description: string): boolean => {
    if (description.length > 350) {
      setErrorProjectDescription(
        "Project description must be maximum 350 characters long",
      );
      return false;
    } else {
      setErrorProjectDescription(null);
      return true;
    }
  };

  /**
   * Handle project name input changes with automatic length limiting
   *
   * @param event - React change event from input element
   *
   * This handler:
   * 1. Automatically trims input to maximum 100 characters
   * 2. Updates the project name state
   * 3. Performs real-time validation and shows errors immediately
   *
   * The length limiting prevents users from entering invalid data,
   * while real-time validation provides immediate feedback.
   */
  const handleProjectNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // Enforce maximum length by slicing input to 100 characters
    const value = event.target.value.slice(0, 100);
    setProjectName(value);

    // Validate and show error for minimum length requirement
    // Maximum length is automatically enforced above
    if (value.length < 1) {
      setErrorProjectName("Project name must be at least 1 character long");
    } else {
      setErrorProjectName(null);
    }
  };

  /**
   * Handle project description input changes with automatic length limiting
   *
   * @param event - React change event from input element
   *
   * This handler:
   * 1. Automatically trims input to maximum 350 characters
   * 2. Updates the project description state
   * 3. Performs real-time validation for length constraints
   *
   * The description field is optional, so no minimum length validation.
   */
  const handleProjectDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // Enforce maximum length by slicing input to 350 characters
    const value = event.target.value.slice(0, 350);
    setProjectDescription(value);

    // Validate maximum length (should rarely trigger due to slice above)
    if (value.length > 350) {
      setErrorProjectDescription(
        "Project description must be maximum 350 characters long",
      );
    } else {
      setErrorProjectDescription(null);
    }
  };

  /**
   * Save changes to the existing project
   *
   * This function:
   * 1. Validates all form fields before saving
   * 2. Creates an updated project object preserving all existing data
   * 3. Updates only the modified fields (title and description)
   * 4. Calls the updateProject function to persist changes
   * 5. Closes the edit mode after successful update
   *
   * The function preserves all existing project data (tasks, snippets, etc.)
   * while only updating the fields that were modified in the form.
   */
  const saveChanges = () => {
    // Validate all form fields before proceeding
    if (
      !projectNameValidation(projectName) ||
      !projectDescriptionValidation(projectDescription)
    ) {
      // Exit early if validation fails - errors are already set by validation functions
      return;
    }

    // Create updated project object preserving all existing data
    const updatedProject = {
      ...project, // Preserve all existing fields (id, status, tasks, snippets, etc.)
      title: projectName, // Update with new title
      description: projectDescription, // Update with new description
    };

    // Persist the changes to the store
    updateProject(project.id, updatedProject);

    // Close the edit mode after successful update
    closeEdit();
  };

  /**
   * Delete the current project and navigate away
   *
   * This function:
   * 1. Calls the deleteProject function to remove the project from the store
   * 2. Navigates to the home page since the current project no longer exists
   *
   * This is a destructive operation - all project data including tasks,
   * snippets, and notes will be permanently lost. The function should
   * typically be called after user confirmation in the UI.
   */
  const deleteEditedProject = () => {
    // Remove the project from the store (permanent deletion)
    deleteProject(project.id);

    // Navigate to home page since the current project no longer exists
    navigate("/");
  };

  // Return the complete edit interface for components to use
  return {
    /** Current project name input value (pre-populated with existing title) */
    projectName,

    /** Current project description input value (pre-populated with existing description) */
    projectDescription,

    /** Error message for project name validation (null if valid) */
    errorProjectName,

    /** Error message for project description validation (null if valid) */
    errorProjectDescription,

    /** Handler for project name input changes with validation */
    handleProjectNameChange,

    /** Handler for project description input changes with validation */
    handleProjectDescriptionChange,

    /** Function to save changes to the project */
    saveChanges,

    /** Function to delete the project (destructive operation) */
    deleteEditedProject,
  };
};
