import TaskBoard from "../components/modules/TaskBoard/TaskBoard";
import styles from "../styles/Pages/MainPages.module.css";

/**
 * TasksPage - Global task management page
 * 
 * Displays all tasks across projects in a kanban-style board.
 * Provides global task creation and management capabilities.
 */
const TasksPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Tasks</h1>
      </div>
      <div className={styles.content}>
        <TaskBoard 
          title="All Tasks"
          showAddButton={true}
        />
      </div>
    </div>
  );
};

export default TasksPage;
