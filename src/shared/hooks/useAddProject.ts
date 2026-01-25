import { useState } from "react";
import type { Project } from "../types/project";

/**
 * useAddProject - Custom hook for adding new projects with validation
 *
 * This hook manages the form state and validation logic for creating new projects.
 * It provides a complete interface for project creation including input validation,
 * error handling, and form submission logic.
 *
 * Features:
 * - Real-time input validation with error messages
 * - Automatic input length limiting to prevent invalid data
 * - Form state management for project name and description
 * - Integration with project management and navigation systems
 *
 * Validation rules:
 * - Project name: minimum 1 character, maximum 100 characters
 * - Project description: maximum 350 characters
 *
 * @param addProject - Function to add a new project to the store
 * @param navigate - Navigation function to redirect after successful creation
 * @returns Object containing form state, handlers, and validation errors
 */
export const useAddProject = (
  addProject: (project: Project) => Promise<void>,
  navigate: (location: string) => void,
) => {
  // Project name state and validation
  const [projectName, setProjectName] = useState<string>("");
  const [errorProjectName, setErrorProjectName] = useState<string | null>(null);

  // Project description state and validation
  const [projectDescription, setProjectDescription] = useState<string>("");
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
   * Handle form submission to add a new project
   *
   * @param e - React mouse event from submit button
   *
   * This function:
   * 1. Prevents default form submission behavior
   * 2. Validates all form fields before submission
   * 3. Creates a new project with default values for required fields
   * 4. Adds the project to the store via the provided addProject function
   * 5. Navigates back to the home page after successful creation
   *
   * The new project includes:
   * - ID: 0 (will be auto-generated by ProjectsProvider)
   * - Title: user-entered project name
   * - Status: "active" (default status for new projects)
   * - Description: user-entered description
   * - Tasks: empty array (user can add tasks later)
   * - Snippets: empty array (user can add code snippets later)
   * - Markdown: empty string (user can add notes later)
   */
  const handleAddProject = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    // Prevent default form submission to handle it manually
    e.preventDefault();

    // Validate all form fields before proceeding
    if (
      !projectNameValidation(projectName) ||
      !projectDescriptionValidation(projectDescription)
    ) {
      // Exit early if validation fails - errors are already set by validation functions
      return;
    }

    try {
      // Create new project object with user input and sensible defaults
      await addProject({
        id: 0, // Will be auto-generated by ProjectsProvider
        title: projectName,
        status: "active", // New projects start as active
        description: projectDescription,
        tasks: [], // Start with empty task list
        snippets: [], // Start with empty code snippets
        markdown: "", // Start with empty markdown notes
      });

      // Navigate back to home page after successful project creation
      navigate("/");
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  // Return the complete form interface for components to use
  return {
    /** Current project name input value */
    projectName,

    /** Error message for project name validation (null if valid) */
    errorProjectName,

    /** Current project description input value */
    projectDescription,

    /** Error message for project description validation (null if valid) */
    errorProjectDescription,

    /** Handler for project name input changes with validation */
    handleProjectNameChange,

    /** Handler for project description input changes with validation */
    handleProjectDescriptionChange,

    /** Handler for form submission to create the project */
    handleAddProject,
  };
};
