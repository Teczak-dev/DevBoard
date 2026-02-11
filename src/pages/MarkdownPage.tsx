import { useState, useRef } from "react";
import mainStyles from "../styles/Pages/MainPages.module.css";
import styles from "../styles/Pages/MarkdownPage.module.css";
import { MarkdownEditor } from "../components/modules/MarkdownEditor/MarkdownEditor";
import { FragmentManager } from "../components/modules/FragmentManager/FragmentManager";
import { useFragments } from "../shared/hooks/useFragments";
import { useTheme } from "../shared/hooks/useTheme";
import type { MarkdownFragment } from "../shared/types/fragment";

const MarkdownPage = () => {
  const { fragments } = useFragments();
  const { theme } = useTheme();
  const [content, setContent] = useState("# Welcome to the Markdown Editor\n\nStart writing your markdown content here...");
  const [showFragments, setShowFragments] = useState(true);
  const editorRef = useRef<{ insertFragment: (fragment: MarkdownFragment) => void }>(null);

  /**
   * Handle markdown content changes
   */
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  /**
   * Handle fragment insertion
   */
  const handleFragmentSelect = (fragment: MarkdownFragment) => {
    if (editorRef.current) {
      editorRef.current.insertFragment(fragment);
    }
  };

  /**
   * Toggle fragment sidebar visibility
   */
  const toggleFragments = () => {
    setShowFragments(!showFragments);
  };

  return (
    <div className={mainStyles.container}>
      <div className={mainStyles.title}>
        <h1>Markdown Editor</h1>
        <button 
          className={styles.toggleButton}
          onClick={toggleFragments}
          title="Toggle fragments sidebar"
        >
          {showFragments ? "Hide Fragments" : "Show Fragments"}
        </button>
      </div>
      
      <div className={styles.editorContainer}>
        <div className={styles.mainEditor}>
          <MarkdownEditor
            ref={editorRef}
            content={content}
            onChange={handleContentChange}
            height="calc(100vh - 200px)"
            fragments={fragments}
            showFragments={false} // Disable built-in sidebar since we use external FragmentManager
            autoSaveDelay={0} // Disable auto-save for standalone editor
            theme={theme}
          />
        </div>
        
        {/* Optional separate fragment manager */}
        <div className={`${styles.fragmentSidebar} ${!showFragments ? styles.hidden : ""}`}>
          <FragmentManager
            onFragmentSelect={handleFragmentSelect}
            height="calc(100vh - 200px)"
          />
        </div>
      </div>
    </div>
  );
};

export default MarkdownPage;
