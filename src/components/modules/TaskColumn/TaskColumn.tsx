import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import styles from "./TaskColumn.module.css";
import TaskCard from "../TaskCard/TaskCard";
import type { Todo, TaskStatus } from "../../../shared/types/todo";

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
 * Uses @hello-pangea/dnd for drop functionality to accept dragged tasks.
 * Automatically updates task status when dropped.
 */
const TaskColumn: React.FC<TaskColumnProps> = ({
  status,
  title,
  tasks,
  onEditTask,
}) => {

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
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${styles.tasksContainer} ${
              snapshot.isDraggingOver ? styles.dropActive : ""
            }`}
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
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
              />
            ))}

            {provided.placeholder}

            {/* Drop indicator */}
            {snapshot.isDraggingOver && (
              <div className={styles.dropIndicator}>
                Drop task here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;