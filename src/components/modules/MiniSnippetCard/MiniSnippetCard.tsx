import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnippets } from '../../../shared/hooks/useSnippets';
import { useSnippetProjectRelations } from '../../../shared/hooks/useSnippetProjectRelations';
import { getLanguageByValue } from '../../../shared/constants/languages';
import Popup from '../../organisms/Popup/Popup';
import styles from './MiniSnippetCard.module.css';
import type { Snippet } from '../../../shared/types/snippet';

interface MiniSnippetCardProps {
  snippetId: number;
  projectId: number;
  onRemove?: () => void;
}

const MiniSnippetCard: React.FC<MiniSnippetCardProps> = ({ 
  snippetId, 
  projectId,
  onRemove 
}) => {
  const navigate = useNavigate();
  const { snippets } = useSnippets();
  const { removeSnippetFromProject } = useSnippetProjectRelations();
  const [showPopup, setShowPopup] = useState(false);
  
  // Get snippet data from storage
  const snippet: Snippet | undefined = snippets.find((s: Snippet) => s.id === snippetId);

  const { previewLines, languageInfo } = useMemo(() => {
    if (!snippet) return { previewLines: [], languageInfo: null };
    
    const lines = snippet.code.split('\n').slice(0, 3); // First 3 lines
    const langInfo = getLanguageByValue(snippet.language);
    
    return {
      previewLines: lines,
      languageInfo: langInfo || { value: snippet.language, label: snippet.language }
    };
  }, [snippet]);

  if (!snippet) {
    return (
      <div className={styles.miniSnippet}>
        <div className={styles.error}>
          Snippet {snippetId} not found
          <button 
            onClick={async () => {
              try {
                await removeSnippetFromProject(snippetId, projectId);
                onRemove?.();
              } catch (error) {
                console.error("Failed to remove broken reference:", error);
              }
            }}
            className={styles.removeButton}
            title="Remove broken reference"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  const handleNavigateToSnippet = () => {
    navigate('/snippets');
  };

  const handleEdit = () => {
    navigate(`/edit-snippet/${snippet.id}`);
  };

  const handleRemove = async () => {
    try {
      await removeSnippetFromProject(snippetId, projectId);
      onRemove?.();
    } catch (error) {
      console.error("Failed to remove snippet from project:", error);
    }
  };

  const handleCopy = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.code);
      setShowPopup(true);
    }
  };

  const togglePopup = () => {
    setShowPopup(false);
  };

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      javascript: '#f7df1e',
      typescript: '#007acc', 
      python: '#3776ab',
      java: '#ed8b00',
      csharp: '#239120',
      cpp: '#00599c',
      c: '#a8b9cc',
      go: '#00add8',
      rust: '#000000',
      php: '#777bb4',
      ruby: '#cc342d',
      swift: '#fa7343',
      kotlin: '#7f52ff',
      html: '#e34f26',
      css: '#1572b6',
      json: '#000000',
      sql: '#336791',
      bash: '#4eaa25',
      default: 'var(--primary)'
    };
    return colors[lang.toLowerCase()] || colors.default;
  };

  return (
    <div className={styles.miniSnippet}>
      {showPopup && (
        <Popup content="Copied to clipboard" togglePopup={togglePopup} />
      )}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h4 className={styles.title}>{snippet.title}</h4>
          <div className={styles.meta}>
            <span 
              className={styles.languageBadge}
              style={{
                backgroundColor: getLanguageColor(snippet.language) + '20',
                color: getLanguageColor(snippet.language),
                border: `1px solid ${getLanguageColor(snippet.language)}40`
              } as React.CSSProperties}
            >
              {languageInfo?.label || snippet.language}
            </span>
            <span className={styles.lineCount}>
              {snippet.code.split('\n').length} lines
            </span>
          </div>
        </div>
        
        <div className={styles.actions}>
          <button
            onClick={handleCopy}
            className={styles.actionButton}
            title="Copy code to clipboard"
          >
            Copy
          </button>
          <button
            onClick={handleEdit}
            className={styles.actionButton}
            title="Edit snippet"
          >
            Edit
          </button>
          <button
            onClick={handleNavigateToSnippet}
            className={styles.actionButton}
            title="Go to snippets page"
          >
            View
          </button>
          <button
            onClick={handleRemove}
            className={`${styles.actionButton} ${styles.removeAction}`}
            title="Remove from project"
          >
            Remove
          </button>
        </div>
      </div>
      
      <div className={styles.preview}>
        {previewLines.map((line, index) => (
          <div key={index} className={styles.previewLine}>
            <span className={styles.lineNumber}>{index + 1}</span>
            <span className={styles.lineCode}>
              {line || ' '}
            </span>
          </div>
        ))}
        {snippet.code.split('\n').length > 3 && (
          <div className={styles.moreIndicator}>
            ... and {snippet.code.split('\n').length - 3} more lines
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniSnippetCard;