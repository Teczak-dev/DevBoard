/**
 * Task status types for organizing tasks in different stages
 */
export type TaskStatus = "todo" | "inProgress" | "done";

/**
 * Todo/Task interface for project task management
 * 
 * Enhanced task system supporting:
 * - Status-based organization (todo/inProgress/done)
 * - Color coding for visual organization
 * - Project association for task management
 * - Rich descriptions and metadata
 */
export interface Todo {
  /** Unique identifier for the task */
  id: number;
  
  /** Task title/name */
  title: string;
  
  /** Detailed task description */
  description: string;
  
  /** Current status of the task */
  status: TaskStatus;
  
  /** Associated project ID (optional for global tasks) */
  projectId?: number;
  
  /** Color for visual organization (hex color code) */
  color: string;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** @deprecated Use status instead. Kept for migration compatibility */
  completed?: boolean;
}
