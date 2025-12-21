import { ProjectsContext } from "./ProjectsContext";
import type { Project } from "../shared/types/project";
import { useState } from "react";
import { TestData } from "../../data/TestData";

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] = useState<Project[]>(TestData);

  const updateProjects: (value: Project[]) => void = (value) => {
    setProjects(value);
  };

  const updateProject = (id: number, project: Project) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => (p.id === id ? project : p)),
    );
  };

  const addProject = (project: Project) => {
    project.id = projects.length + 1;
    setProjects((prevProjects) => [...prevProjects, project]);
  };

  const deleteProject = (id: number) => {
    setProjects((prevProjects) => prevProjects.filter((p) => p.id !== id));
  };

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
