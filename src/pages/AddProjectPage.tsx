import React from "react";
import styles from "../styles/Pages/AddProject.module.css";
import { useNavigate } from "react-router-dom";
import { useAddProject } from "../shared/hooks/useAddProject";
import { useProjects } from "../shared/hooks/useProjects";
import { Link } from "react-router-dom";
import { TextField } from "@mui/material";

const AddProjectPage: React.FC = () => {
  const { addProject } = useProjects();
  const navigate = useNavigate();
  const {
    projectName,
    errorProjectName,
    projectDescription,
    errorProjectDescription,
    handleProjectNameChange,
    handleProjectDescriptionChange,
    handleAddProject,
  } = useAddProject(addProject, navigate);

  return (
    <div className={styles.container}>
      <h1>Add Project</h1>
      <Link className={styles.backLink} to="/">
        Go back to dashboard
      </Link>
      <p className={styles.description}>
        Create a new project by filling out the form below.
      </p>
      <form className={styles.form}>
        <label>
          Name:
          <TextField
            id={errorProjectName ? "outlined-error-helper-text" : "name"}
            name="name"
            value={projectName}
            onChange={handleProjectNameChange}
            variant="outlined"
            helperText={
              errorProjectName
                ? errorProjectName
                : `${projectName.length}/100 characters`
            }
            error={Boolean(errorProjectName)}
            fullWidth
            className={styles.inputFull}
            size="small"
            inputProps={{ maxLength: 100 }}
          />
        </label>
        <label>
          Description:
          <TextField
            id="description"
            name="description"
            value={projectDescription}
            helperText={`${projectDescription.length}/350 characters`}
            onChange={handleProjectDescriptionChange}
            variant="outlined"
            error={Boolean(errorProjectDescription)}
            fullWidth
            className={styles.inputFull}
            size="small"
            inputProps={{ maxLength: 350 }}
          />
        </label>
        <button type="submit" onClick={(e) => handleAddProject(e)}>
          Create Project
        </button>
      </form>
    </div>
  );
};
export default AddProjectPage;
