import React from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../styles/Pages/ProjectPage.module.css";
import { useProjects } from "../shared/hooks/useProjects";
import type { Project } from "../shared/types/project";
import { height } from "@mui/system";

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { projects, updateProject } = useProjects();
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
  const parsedId = Number.parseInt(id, 10);
  if (Number.isNaN(parsedId)) {
    return (
      <div className={styles.container}>
        <h1>Invalid project id</h1>
        <p>The provided id "{id}" is not a valid number.</p>
        <Link to="/">Go back to dashboard</Link>
      </div>
    );
  }

  // Find the item
  const item = projects.find((it) => it.id === parsedId);
  if (!item) {
    return (
      <div className={styles.container}>
        <h1>Project not found</h1>
        <p>No project exists with id {parsedId}.</p>
        <Link to="/">Go back to dashboard</Link>
      </div>
    );
  }

  const changeStatus = () => {
    const newStatus = item.status === "active" ? "inactive" : "active";
    const updated: Project = { ...item, status: newStatus };
    updateProject(item.id, updated);
  };

  // Render project details
  return (
    <div className={styles.container}>
      <Link className={styles.backLink} to="/">
        Go back to dashboard
      </Link>
      <button className={styles.button} onClick={changeStatus}>
        Change Status
      </button>
      <h1>{item.title}</h1>
      <p>Project id: {item.id}</p>
      <p>Status: {item.status}</p>
      <p
        style={{
          maxWidth: "300px",
          maxHeight: "300px",
          textWrap: "wrap",
          textAlign: "center",
        }}
      >
        Description:
        <br /> {item.description}
      </p>
      <div className={styles.details}>
        <div className={styles.firstRow}>
          <div className={styles.tasks}>
            <h2>Tasks</h2>
            {item.tasks ? (
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
            {item.snippets ? (
              <ul>
                {item.snippets.map((snippet) => (
                  <li key={snippet}>{snippet}</li>
                ))}
              </ul>
            ) : (
              <p>No snippets found</p>
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
