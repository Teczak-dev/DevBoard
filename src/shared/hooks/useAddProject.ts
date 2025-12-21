import { useState } from "react";
import type { Project } from "../types/project";

export const useAddProject = (
  addProject: (project: Project) => void,
  navigate: (location: string) => void,
) => {
  const [projectName, setProjectName] = useState<string>("");
  const [errorProjectName, setErrorProjectName] = useState<string | null>(null);
  const [projectDescription, setProjectDescription] = useState<string>("");
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

  const handleAddProject = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (
      !projectNameValidation(projectName) ||
      !projectDescriptionValidation(projectDescription)
    )
      return;

    addProject({
      id: 0,
      title: projectName,
      status: "active",
      description: projectDescription,
      tasks: [],
      snippets: [],
      markdown: "",
    });
    navigate("/");
  };

  return {
    projectName,
    errorProjectName,
    projectDescription,
    errorProjectDescription,
    handleProjectNameChange,
    handleProjectDescriptionChange,
    handleAddProject,
  };
};
