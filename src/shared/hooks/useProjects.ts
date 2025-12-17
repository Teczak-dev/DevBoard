import { useContext } from "react";
import { ProjectsContext } from "../../context/ProjectsContext";
// Custom hook to access the current theme from context
export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects musi być użyty w ProjectsProviderze");
  }
  return context;
}
