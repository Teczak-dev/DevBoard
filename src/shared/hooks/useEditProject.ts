import { useState } from "react";
import type { Project } from "../types/project";

export const useEditProject = (
  project: Project,
  updateProject: (id: number, project: Project) => void,
  deleteProject: (id: number) => void,
  closeEdit: () => void,
  navigate: (to: string) => void,
) => {
  const [projectName, setProjectName] = useState<string>(project.title);
  const [errorProjectName, setErrorProjectName] = useState<string | null>(null);
  const [projectDescription, setProjectDescription] = useState<string>(
    project.description || "",
  );
  const [errorProjectDescription, setErrorProjectDescription] = useState<
    string | null
  >(null);

  // Validate minimal constraints (max lengths are enforced on-change by slicing)
  const projectNameValidation = (name: string): boolean => {
    if (name.length < 1) {
      setErrorProjectName("Project name must be at least 1 character long");
      return false;
    } else {
      setErrorProjectName(null);
      return true;
    }
  };

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

  // Enforce max-length on input change so user cannot type beyond limits
  const handleProjectNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value.slice(0, 100); // clamp to 100 chars
    setProjectName(value);

    // show validation only for too-short names; max is enforced above
    if (value.length < 1) {
      setErrorProjectName("Project name must be at least 1 character long");
    } else {
      setErrorProjectName(null);
    }
  };

  const handleProjectDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value.slice(0, 350);
    setProjectDescription(value);

    if (value.length > 350) {
      setErrorProjectDescription(
        "Project description must be maximum 350 characters long",
      );
    } else {
      setErrorProjectDescription(null);
    }
  };

  const saveChanges = () => {
    if (
      !projectNameValidation(projectName) ||
      !projectDescriptionValidation(projectDescription)
    )
      return;
    const updatedProject = {
      ...project,
      title: projectName,
      description: projectDescription,
    };
    updateProject(project.id, updatedProject);
    closeEdit();
  };

  const deleteEditedProject = () => {
    deleteProject(project.id);
    navigate("/");
  };

  return {
    projectName,
    projectDescription,
    errorProjectName,
    errorProjectDescription,
    handleProjectNameChange,
    handleProjectDescriptionChange,
    saveChanges,
    deleteEditedProject,
  };
};
