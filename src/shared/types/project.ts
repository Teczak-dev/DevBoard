/**
 * Project interface for project management
 * 
 * Represents a development project with all associated metadata.
 * Tasks are now managed separately in the todos system and linked via projectId.
 */
export interface Project {
  /** Unique identifier for the project */
  id: number;
  
  /** Project name/title */
  title: string;
  
  /** Project status - active or inactive */
  status: "active" | "inactive";
  
  /** Optional project description */
  description?: string;
  
  /** Array of snippet IDs associated with this project */
  snippets?: number[];
  
  /** @deprecated Use todos system instead. Array of task IDs - kept for migration compatibility */
  tasks?: number[];
  
  /** Optional markdown content for project documentation */
  markdown?: string;
  
  /** Array of custom markdown fragment IDs for this project */
  markdownFragments?: number[];
}
