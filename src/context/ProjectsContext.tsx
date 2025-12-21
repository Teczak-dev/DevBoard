import { createContext } from "react";
import type { Project } from "../shared/types/project";

export interface ProjectsContextType {
  projects: Project[];
  updateProjects: (value: Project[]) => void;
  updateProject: (id: number, project: Project) => void;
  addProject: (project: Project) => void;
  deleteProject: (id: number) => void;
}

export const ProjectsContext = createContext<ProjectsContextType | null>(null);
