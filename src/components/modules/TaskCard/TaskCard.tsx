import React, { useState } from "react";
import { useDrag } from "react-dnd";
import styles from "./TaskCard.module.css";
import type { Todo } from "../../../shared/types/todo";
import { useTodos } from "../../../shared/hooks/useTodos";

interface TaskCardProps {
  task: Todo;
  onEdit?: (task: Todo) => void;
}

/**
 * TaskCard - Individual task display component
 * 
 * Displays a single task with:
 * - Color-coded visual indicator
 * - Title and description
 * - Drag and drop functionality
 * - Edit and delete actions
 * - Hover interactions
 * 
 * Uses React DnD for drag functionality to move between columns.
 * Follows the existing card design patterns from the app.
 */
const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { deleteTodo } = useTodos();
  const [isDeleting, setIsDeleting] = useState(false);

  // React DnD drag functionality
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: () => ({ 
      id: task.id, 
      status: task.status,
      originalTask: task // Pass full task for debugging
    }),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (_, monitor) => {
      // Reset dragging state when drag ends
      if (!monitor.didDrop()) {
        // Handle case where drag was cancelled
      }
    },
  }), [task.id, task.status]); // Add dependencies to ensure fresh data

  /**
   * Handle task deletion with confirmation
   */
  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await deleteTodo(task.id);
    } catch (error) {
      console.error("Error deleting task:", error);
      setIsDeleting(false);
    }
  };

  /**
   * Handle edit button click
   */
  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    }
  };

  return (
    <div
      ref={drag as any}
      className={`${styles.taskCard} ${isDragging ? styles.dragging : ""}`}
      style={{ borderLeftColor: task.color }}
    >
      {/* Color indicator */}
      <div 
        className={styles.colorIndicator} 
        style={{ backgroundColor: task.color }}
      />
      
      {/* Task content */}
      <div className={styles.taskContent}>
        <h3 className={styles.taskTitle}>{task.title}</h3>
        {task.description && (
          <p className={styles.taskDescription}>{task.description}</p>
        )}
        
        {/* Task metadata */}
        <div className={styles.taskMeta}>
          <span className={styles.taskDate}>
            {new Date(task.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      {/* Actions */}
      <div className={styles.taskActions}>
        <button
          className={styles.editBtn}
          onClick={handleEdit}
          title="Edit task"
          aria-label="Edit task"
        >
          Edit
        </button>
        <button
          className={`${styles.deleteBtn} ${isDeleting ? styles.deleting : ""}`}
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete task"
          aria-label="Delete task"
        >
          {isDeleting ? "..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;