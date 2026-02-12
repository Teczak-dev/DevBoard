import React, { useState, useMemo } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import styles from "./TaskBoard.module.css";
import TaskColumn from "../TaskColumn/TaskColumn";
import TaskForm from "../TaskForm/TaskForm";
import type { Todo, TaskStatus } from "../../../shared/types/todo";
import { useTodos } from "../../../shared/hooks/useTodos";

// Define DropResult interface based on @hello-pangea/dnd structure
interface DropResult {
  draggableId: string;
  type: string;
  source: {
    index: number;
    droppableId: string;
  };
  reason: 'DROP' | 'CANCEL';
  mode: string;
  destination: {
    droppableId: string;
    index: number;
  } | null;
  combine: null;
}

interface TaskBoardProps {
  /** Optional project ID to filter tasks */
  projectId?: number;
  /** Show add task button */
  showAddButton?: boolean;
  /** Custom title for the board */
  title?: string;
}

/**
 * TaskBoard - Main kanban-style task management component
 * 
 * Provides a complete task management interface with:
 * - Three columns: To Do, In Progress, Done
 * - Drag & drop functionality between columns
 * - Task creation and editing
 * - Project-specific or global task filtering
 * - Responsive design
 * 
 * Uses @hello-pangea/dnd for drag & drop functionality.
 * Integrates with TodosContext for state management.
 */
const TaskBoard: React.FC<TaskBoardProps> = ({
  projectId,
  showAddButton = true,
  title = "Tasks",
}) => {
  const { todos, getTodosForProject, updateTaskStatus } = useTodos();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Todo | null>(null);

  /**
   * Get filtered tasks based on project ID
   */
  const filteredTasks = useMemo(() => {
    return projectId !== undefined 
      ? getTodosForProject(projectId) 
      : todos;
  }, [todos, getTodosForProject, projectId]);

  /**
   * Organize tasks by status
   */
  const tasksByStatus = useMemo(() => {
    const organized = {
      todo: [] as Todo[],
      inProgress: [] as Todo[],
      done: [] as Todo[],
    };

    filteredTasks.forEach((task) => {
      // Ensure task status is valid before organizing
      if (task.status === "todo" || task.status === "inProgress" || task.status === "done") {
        organized[task.status].push(task);
      } else {
        console.warn("Task with invalid status found:", task.status, task);
      }
    });

    // Sort by updated date (newest first)
    Object.values(organized).forEach((statusTasks) => {
      statusTasks.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    });

    return organized;
  }, [filteredTasks]);

  /**
   * Handle drag end event
   */
  const handleOnDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If no destination, do nothing
    if (!destination) return;

    // If dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Extract task ID from draggableId (format: "task-{id}")
    const taskId = parseInt(draggableId.replace("task-", ""));
    const newStatus = destination.droppableId as TaskStatus;

    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  /**
   * Handle opening task form for new task
   */
  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  /**
   * Handle opening task form for editing
   */
  const handleEditTask = (task: Todo) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  /**
   * Handle closing task form
   */
  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  /**
   * Column configuration
   */
  const columns: Array<{
    status: TaskStatus;
    title: string;
    tasks: Todo[];
  }> = [
    {
      status: "todo",
      title: "To Do",
      tasks: tasksByStatus.todo,
    },
    {
      status: "inProgress", 
      title: "In Progress",
      tasks: tasksByStatus.inProgress,
    },
    {
      status: "done",
      title: "Done",
      tasks: tasksByStatus.done,
    },
  ];

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className={styles.taskBoard}>
        {/* Board header */}
        <div className={styles.boardHeader}>
          <h2 className={styles.boardTitle}>{title}</h2>
          {showAddButton && (
            <button
              className={styles.addTaskBtn}
              onClick={handleAddTask}
              aria-label="Add new task"
            >
              + Add Task
            </button>
          )}
        </div>

        {/* Task statistics */}
        <div className={styles.boardStats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {tasksByStatus.todo.length}
            </span>
            <span className={styles.statLabel}>To Do</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {tasksByStatus.inProgress.length}
            </span>
            <span className={styles.statLabel}>In Progress</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {tasksByStatus.done.length}
            </span>
            <span className={styles.statLabel}>Done</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {filteredTasks.length}
            </span>
            <span className={styles.statLabel}>Total</span>
          </div>
        </div>

        {/* Kanban columns */}
        <div className={styles.columnsContainer}>
          {columns.map((column) => (
            <TaskColumn
              key={column.status}
              status={column.status}
              title={column.title}
              tasks={column.tasks}
              onEditTask={handleEditTask}
            />
          ))}
        </div>

        {/* Task form modal */}
        {showTaskForm && (
          <TaskForm
            task={editingTask}
            projectId={projectId}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;