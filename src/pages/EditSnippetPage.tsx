import React from "react";
import styles from "../styles/Pages/AddSnippet.module.css";
import { TextField } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSnippets } from "../shared/hooks/useSnippets";
import { useEditSnippet } from "../shared/hooks/useEditSnippet";
import LanguageSelect from "../components/modules/LanguageSelect/LanguageSelect";
import CodeEditor from "../components/modules/CodeEditor/CodeEditor";

/**
 * EditSnippetPage
 *
 * Page for editing existing snippets
 */
const EditSnippetPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { snippets, updateSnippet } = useSnippets();
  const navigate = useNavigate();
  
  const snippetId = id ? parseInt(id, 10) : null;
  const snippet = snippets.find(s => s.id === snippetId);

  const {
    snippetTitle,
    snippetLanguage,
    snippetCode,
    autoDetectResult,
    handleSnippetTitleChange,
    handleSnippetLanguageChange,
    handleSnippetCodeChange,
    handleUpdateSnippet,
    isLoading
  } = useEditSnippet(snippet, updateSnippet, navigate);

  if (!snippetId || !snippet) {
    return (
      <div className={styles.container}>
        <h1>Snippet Not Found</h1>
        <Link className={styles.backLink} to="/snippets">
          Go back to Snippets
        </Link>
        <p className={styles.description}>
          The snippet you're trying to edit doesn't exist or has been deleted.
        </p>
      </div>
    );
  }

  const isFormValid = snippetTitle.trim().length > 0 && snippetCode.trim().length > 0;

  return (
    <div className={styles.container}>
      <h1>Edit Snippet</h1>
      <Link className={styles.backLink} to="/snippets">
        Go back to Snippets
      </Link>
      <p className={styles.description}>
        Edit your snippet below. Use Ctrl+S (Cmd+S) to save quickly.
      </p>
      <form className={styles.form}>
        <div className={styles.field}>
          <label>
            Name:
          </label>
          <TextField
            name="name"
            value={snippetTitle}
            onChange={handleSnippetTitleChange}
            variant="outlined"
            fullWidth
            className={styles.inputFull}
            size="small"
            inputProps={{ maxLength: 100 }}
            placeholder="Enter snippet name..."
          />
        </div>

        <div className={styles.field}>
          <label>
            Language:
          </label>
          <LanguageSelect
            value={snippetLanguage}
            onChange={handleSnippetLanguageChange}
            autoDetectedLanguage={autoDetectResult?.language}
            autoDetectedConfidence={autoDetectResult?.confidence}
          />
        </div>

        <div className={styles.field}>
          <label>
            Code:
          </label>
          <CodeEditor
            value={snippetCode}
            onChange={handleSnippetCodeChange}
            language={snippetLanguage === 'auto' && autoDetectResult ? autoDetectResult.language : snippetLanguage}
            placeholder="Enter your code here..."
          />
        </div>

        <div className={styles.formActions}>
          <button 
            type="button" 
            onClick={() => navigate("/snippets")}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            onClick={(e) => handleUpdateSnippet(e)}
            disabled={!isFormValid || isLoading}
            className={!isFormValid || isLoading ? styles.buttonDisabled : ''}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSnippetPage;