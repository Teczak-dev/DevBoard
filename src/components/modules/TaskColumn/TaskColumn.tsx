import React, { useState } from "react";
import { useDrop } from "react-dnd";
import styles from "./TaskColumn.module.css";
import TaskCard from "../TaskCard/TaskCard";
import type { Todo, TaskStatus } from "../../../shared/types/todo";
import { useTodos } from "../../../shared/hooks/useTodos";

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Todo[];
  onEditTask?: (task: Todo) => void;
}

/**
 * TaskColumn - Column component for kanban-style task organization
 * 
 * Displays tasks in a specific status category with:
 * - Drop zone for drag & drop functionality
 * - Task count display
 * - Scrollable task list
 * - Visual feedback during drag operations
 * 
 * Uses React DnD for drop functionality to accept dragged tasks.
 * Automatically updates task status when dropped.
 */
const TaskColumn: React.FC<TaskColumnProps> = ({
  status,
  title,
  tasks,
  onEditTask,
}) => {
  const { updateTaskStatus } = useTodos();
  const [isUpdating, setIsUpdating] = useState(false);

  // React DnD drop functionality
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "task",
    drop: async (item: { id: number; status: TaskStatus; originalTask?: Todo }) => {
      // Only update if status is different
      if (item.status !== status && !isUpdating) {
        setIsUpdating(true);
        try {
          await updateTaskStatus(item.id, status);
        } catch (error) {
          console.error("Error updating task status:", error);
        } finally {
          setIsUpdating(false);
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop() && !isUpdating,
    }),
  }), [status, updateTaskStatus, isUpdating]);

  /**
   * Get column status indicator color
   */
  const getStatusColor = (): string => {
    switch (status) {
      case "todo":
        return "#ef4444"; // Red
      case "inProgress":
        return "#f59e0b"; // Orange
      case "done":
        return "#10b981"; // Green
      default:
        return "#6b7280"; // Gray
    }
  };

  return (
    <div className={styles.columnContainer}>
      {/* Column header */}
      <div className={styles.columnHeader}>
        <div className={styles.statusIndicator}>
          <div 
            className={styles.statusDot}
            style={{ backgroundColor: getStatusColor() }}
          />
          <h3 className={styles.columnTitle}>{title}</h3>
        </div>
        <span className={styles.taskCount}>
          {tasks.length}
        </span>
      </div>

      {/* Drop zone and tasks list */}
      <div
        ref={drop as any}
        className={`${styles.tasksContainer} ${
          isOver && canDrop ? styles.dropActive : ""
        } ${canDrop ? styles.canDrop : ""}`}
      >
        {/* Empty state */}
        {tasks.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              {status === "todo" && "No tasks yet"}
              {status === "inProgress" && "No tasks in progress"}
              {status === "done" && "No completed tasks"}
            </p>
            <p className={styles.emptyHint}>
              Drag tasks here or create new ones
            </p>
          </div>
        )}

        {/* Tasks list */}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
          />
        ))}

        {/* Drop indicator */}
        {isOver && canDrop && (
          <div className={styles.dropIndicator}>
            Drop task here
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;