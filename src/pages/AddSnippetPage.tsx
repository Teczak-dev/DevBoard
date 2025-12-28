import React from "react";
import styles from "../styles/Pages/AddSnippet.module.css";
import { TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useSnippets } from "../shared/hooks/useSnippets";
import { useAddSnippet } from "../shared/hooks/useAddSnippet";
/**
 * AddSnippetPage
 *
 * Page wrapper that reuses the AddSnippet module and shared UI primitives.
 */
const AddSnippetPage: React.FC = () => {
  const { addSnippet } = useSnippets();
  const navigate = useNavigate();
  const {
    snippetTitle,
    snippetLanguage,
    snippetCode,
    handleSnippetTitleChange,
    handleSnippetLanguageChange,
    handleSnippetCodeChange,
    handleAddSnippet,
  } = useAddSnippet(addSnippet, navigate);
  return (
    <div className={styles.container}>
      <h1>Add Snippet</h1>
      <Link className={styles.backLink} to="/snippets">
        Go back to Snippets
      </Link>
      <p className={styles.description}>
        Create a new snippet by filling out the form below.
      </p>
      <form className={styles.form}>
        <label>
          Name:
          <TextField
            // id={errorProjectName ? "outlined-error-helper-text" : "name"}
            name="name"
            value={snippetTitle}
            onChange={handleSnippetTitleChange}
            variant="outlined"
            // helperText={
            // errorProjectName
            // ? errorProjectName
            // : `${projectName.length}/100 characters`
            // }
            //error={Boolean(errorProjectName)}
            fullWidth
            className={styles.inputFull}
            size="small"
            inputProps={{ maxLength: 100 }}
          />
        </label>
        <label>
          Language:
          <TextField
            id="language"
            name="language"
            value={snippetLanguage}
            onChange={handleSnippetLanguageChange}
            variant="outlined"
            // error={Boolean(errorSnippetLanguage)}
            fullWidth
            className={styles.inputFull}
            size="small"
            inputProps={{ maxLength: 100 }}
          />
        </label>
        <label>
          Code:
          <TextField
            id="outlined-multiline-static"
            name="code"
            value={snippetCode}
            onChange={handleSnippetCodeChange}
            variant="outlined"
            multiline
            // error={Boolean(errorSnippetCode)}
            fullWidth
            className={styles.inputFull}
            size="small"
          />
        </label>
        <button type="submit" onClick={(e) => handleAddSnippet(e)}>
          Create Project
        </button>
      </form>
    </div>
  );
};

export default AddSnippetPage;
