import React, { useState, useEffect } from "react";
import styles from "./TaskForm.module.css";
import type { Todo, TaskStatus } from "../../../shared/types/todo";
import { useTodos } from "../../../shared/hooks/useTodos";

interface TaskFormProps {
  /** Task to edit (null for new task) */
  task?: Todo | null;
  /** Project ID to associate task with */
  projectId?: number;
  /** Form close callback */
  onClose: () => void;
}

/**
 * TaskForm - Modal form for creating and editing tasks
 * 
 * Features:
 * - Create new tasks or edit existing ones
 * - Color picker for task customization
 * - Status selection
 * - Project association
 * - Form validation
 * - Modal overlay with click-outside-to-close
 * 
 * Follows existing form patterns from the app.
 */
const TaskForm: React.FC<TaskFormProps> = ({
  task,
  projectId,
  onClose,
}) => {
  const { addTodo, updateTodo } = useTodos();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    color: "#3B82F6",
  });

  // Predefined colors for quick selection
  const predefinedColors = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Green
    "#F59E0B", // Orange
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
    "#F97316", // Orange (different)
    "#84CC16", // Lime
    "#EC4899", // Pink
    "#6B7280", // Gray
  ];

  /**
   * Initialize form with task data if editing
   */
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        color: task.color,
      });
    }
  }, [task]);

  /**
   * Handle input changes
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle color selection
   */
  const handleColorSelect = (color: string) => {
    setFormData(prev => ({
      ...prev,
      color,
    }));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return; // Title is required
    }

    setIsSubmitting(true);
    
    try {
      if (task) {
        // Update existing task
        const updatedTask: Todo = {
          ...task,
          title: formData.title.trim(),
          description: formData.description.trim(),
          status: formData.status,
          color: formData.color,
        };
        await updateTodo(task.id, updatedTask);
      } else {
        // Create new task
        await addTodo({
          title: formData.title.trim(),
          description: formData.description.trim(),
          status: formData.status,
          color: formData.color,
          projectId,
        });
      }
      
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle overlay click (close modal)
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Header */}
          <div className={styles.header}>
            <h3 className={styles.title}>
              {task ? "Edit Task" : "Create New Task"}
            </h3>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close form"
            >
              ✕
            </button>
          </div>

          {/* Title field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="title" className={styles.label}>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter task title..."
              required
              maxLength={100}
            />
          </div>

          {/* Description field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Enter task description..."
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Status field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="status" className={styles.label}>
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Color picker */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Color</label>
            <div className={styles.colorPicker}>
              {/* Predefined colors */}
              <div className={styles.colorGrid}>
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`${styles.colorButton} ${
                      formData.color === color ? styles.selected : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
              
              {/* Custom color input */}
              <div className={styles.customColor}>
                <label htmlFor="customColor" className={styles.customColorLabel}>
                  Custom:
                </label>
                <input
                  id="customColor"
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  className={styles.colorInput}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? "Saving..." : task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;