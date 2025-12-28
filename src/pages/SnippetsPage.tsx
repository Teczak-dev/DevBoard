import mainStyles from "../styles/Pages/MainPages.module.css";
import styles from "../styles/Pages/SnippetsPage.module.css";
import { useSnippets } from "../shared/hooks/useSnippets";
import { useNavigate } from "react-router-dom";
import SnippetCard from "../components/modules/SnippetCard/SnippetCard";

const SnippetsPage = () => {
  const { snippets } = useSnippets();
  const navigate = useNavigate();
  return (
    <div className={mainStyles.container}>
      <div className={mainStyles.title}>
        <h1>Snippets</h1>
        <div>
          <button
            className={styles.button}
            onClick={() => navigate("/add-snippet")}
          >
            Create Snippet
          </button>
        </div>
      </div>
      <p className={mainStyles.description}>Look at those beauties!</p>
      <div className={styles.content}>
        {snippets.length === 0 ? (
          <p className={mainStyles.description}>
            No snippets created yet.
            <br />
            Create one now by clicking the Create Snippet button.
          </p>
        ) : (
          snippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))
        )}
      </div>
    </div>
  );
};

export default SnippetsPage;
