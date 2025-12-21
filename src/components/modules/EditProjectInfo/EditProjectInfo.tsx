import type { Project } from "../../../shared/types/project";
import { TextField } from "@mui/material";
import { useEditProject } from "../../../shared/hooks/useEditProject";
import { useProjects } from "../../../shared/hooks/useProjects";
import styles from "./EditProjectInfo.module.css";
import { useNavigate } from "react-router-dom";

const EditProjectInfo = ({
  item,
  closeEdit,
}: {
  item: Project;
  closeEdit: () => void;
}) => {
  const { updateProject, deleteProject } = useProjects();
  const navigate = useNavigate();
  const {
    projectName,
    projectDescription,
    errorProjectName,
    errorProjectDescription,
    handleProjectNameChange,
    handleProjectDescriptionChange,
    saveChanges,
    deleteEditedProject,
  } = useEditProject(item, updateProject, deleteProject, closeEdit, navigate);

  return (
    <div style={{ maxWidth: "50%", textAlign: "center" }}>
      <label style={{ textAlign: "left" }}>
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
      <p style={{ marginTop: "5px" }}>Project id: {item.id}</p>
      <label style={{ textAlign: "left" }}>
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
      <button className={styles.button} onClick={saveChanges}>
        Save Changes
      </button>
      <button
        className={`${styles.button} ${styles.delete}`}
        onClick={deleteEditedProject}
      >
        Delete Project
      </button>
    </div>
  );
};
export default EditProjectInfo;
