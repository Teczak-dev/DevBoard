import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "../styles/Pages/ProjectPage.module.css";
import { useProjects } from "../shared/hooks/useProjects";
import { useSnippetProjectRelations } from "../shared/hooks/useSnippetProjectRelations";
import { useFragments } from "../shared/hooks/useFragments";
import { useTheme } from "../shared/hooks/useTheme";
import type { Project } from "../shared/types/project";
import ProjectInfo from "../components/modules/ProjectInfo/ProjectInfo";
import EditProjectInfo from "../components/modules/EditProjectInfo/EditProjectInfo";
import MiniSnippetCard from "../components/modules/MiniSnippetCard/MiniSnippetCard";
import TaskBoard from "../components/modules/TaskBoard/TaskBoard";
import { MarkdownEditor } from "../components/modules/MarkdownEditor/MarkdownEditor";

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { projects, updateProject } = useProjects();
  const { getSnippetsForProject } = useSnippetProjectRelations();
  const { fragments } = useFragments();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingMarkdown, setIsEditingMarkdown] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  if (!id) {
    return (
      <div className={styles.container}>
        <h1>Project</h1>
        <p>No project id specified in the URL.</p>
        <Link to="/">Go back to dashboard</Link>
      </div>
    );
  }

  // Parse id safely (base 10) and validate
  const projectId = parseInt(id, 10);
  if (isNaN(projectId)) {
    return (
      <div className={styles.container}>
        <h1>Project</h1>
        <p>Invalid project ID in the URL.</p>
        <Link to="/">Go back to dashboard</Link>
      </div>
    );
  }

  const item = projects.find((p) => p.id === projectId);
  if (!item) {
    return (
      <div className={styles.container}>
        <h1>Project not found</h1>
        <p>No project exists with id {projectId}.</p>
        <Link to="/">Go back to dashboard</Link>
      </div>
    );
  }

  const snippetsInProject = getSnippetsForProject(projectId);
  
  const handleSnippetRemoved = () => {
    setRefreshKey(prev => prev + 1);
  };

  const changeStatus = () => {
    const newStatus = item.status === "active" ? "inactive" : "active";
    const updated: Project = { ...item, status: newStatus };
    updateProject(item.id, updated);
  };

  const editProject = () => {
    setIsEditing(!isEditing);
  };

  /**
   * Handle markdown content changes and save to project
   */
  const handleMarkdownChange = async (newContent: string) => {
    const updated: Project = { ...item, markdown: newContent };
    await updateProject(item.id, updated);
  };

  /**
   * Toggle markdown editing mode
   */
  const toggleMarkdownEdit = () => {
    setIsEditingMarkdown(!isEditingMarkdown);
  };

  // Render project details
  return (
    <div className={styles.container}>
      <Link className={styles.backLink} to="/">
        Go back to dashboard
      </Link>
      <div className={styles.rightButtons}>
        <button className={styles.button} onClick={editProject}>
          {isEditing ? "Cancel" : "Edit Project"}
        </button>
        <button
          className={`${styles.button} ${item.status === "active" ? styles.active : styles.inactive}`}
          onClick={changeStatus}
        >
          {item.status === "active" ? "active" : "inactive"}
        </button>
      </div>
      {isEditing ? (
        <EditProjectInfo item={item} closeEdit={editProject} />
      ) : (
        <ProjectInfo item={item} />
      )}
      <div className={styles.details}>
        {/* Full width task board */}
        <div className={styles.tasksSection}>
          <TaskBoard 
            projectId={projectId}
            title="Project Tasks"
            showAddButton={true}
          />
        </div>
        
        {/* Bottom row: snippets and markdown side by side */}
        <div className={styles.bottomRow}>
          <div className={styles.snippets}>
            <h2>Snippets</h2>
            {snippetsInProject.length > 0 ? (
              <div className={styles.snippetsList} key={refreshKey}>
                {snippetsInProject.map((snippet) => (
                  <MiniSnippetCard
                    key={snippet.id}
                    snippetId={snippet.id}
                    projectId={projectId}
                    onRemove={handleSnippetRemoved}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No snippets in this project yet.</p>
                <Link to="/snippets" className={styles.addSnippetsLink}>
                  Go to snippets to add some →
                </Link>
              </div>
            )}
          </div>
          <div className={styles.markdown}>
            <div className={styles.markdownHeader}>
              <h2>Markdown</h2>
              <button
                className={styles.button}
                onClick={toggleMarkdownEdit}
                title={isEditingMarkdown ? "View mode" : "Edit mode"}
              >
                {isEditingMarkdown ? "View" : "Edit"}
              </button>
            </div>
            
            {isEditingMarkdown ? (
              <MarkdownEditor
                content={item.markdown || ""}
                onChange={handleMarkdownChange}
                height="500px"
                placeholder="Start writing your project documentation..."
                fragments={fragments}
                showFragments={true}
                autoSaveDelay={2000}
                onAutoSave={handleMarkdownChange}
                theme={theme}
              />
            ) : (
              <div className={styles.markdownView}>
                {item.markdown ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.markdown}</ReactMarkdown>
                ) : (
                  <p className={styles.emptyMarkdown}>
                    No markdown content yet. Click "Edit" to start writing.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
