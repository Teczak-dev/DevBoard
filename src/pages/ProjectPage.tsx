import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../styles/Pages/ProjectPage.module.css";
import { useProjects } from "../shared/hooks/useProjects";
import { useSnippetProjectRelations } from "../shared/hooks/useSnippetProjectRelations";
import type { Project } from "../shared/types/project";
import ProjectInfo from "../components/modules/ProjectInfo/ProjectInfo";
import EditProjectInfo from "../components/modules/EditProjectInfo/EditProjectInfo";
import MiniSnippetCard from "../components/modules/MiniSnippetCard/MiniSnippetCard";

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { projects, updateProject } = useProjects();
  const { getSnippetsForProject } = useSnippetProjectRelations();
  const [isEditing, setIsEditing] = useState(false);
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
        <div className={styles.firstRow}>
          <div className={styles.tasks}>
            <h2>Tasks</h2>
            {Array.isArray(item.tasks) && item.tasks.length > 0 ? (
              <ul>
                {item.tasks.map((task) => (
                  <li key={task}>{task}</li>
                ))}
              </ul>
            ) : (
              <p>No tasks found</p>
            )}
          </div>
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
        </div>
        <div className={styles.markdown}>
          <h2>Markdown</h2>
          {item.markdown ? (
            <div dangerouslySetInnerHTML={{ __html: item.markdown }} />
          ) : (
            <p>No markdown found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
