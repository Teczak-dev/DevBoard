import { useContext } from "react";
import { ProjectsContext } from "../../context/ProjectsContext";
// Custom hook to access the current projects from context
export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within ProjectsProvider");
  }
  return context;
}
