/**
 * MarkdownEditor - Split-view markdown editor with live preview
 * 
 * Features:
 * - Split view: editor on left, preview on right
 * - Live preview with react-markdown
 * - GitHub Flavored Markdown support
 * - Syntax highlighting for code blocks
 * - Fragment insertion system
 * - Auto-save functionality
 * - Responsive design
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./MarkdownEditor.module.css";
import type { MarkdownFragment } from "../../../shared/types/fragment";

interface MarkdownEditorProps {
  /** Current markdown content */
  content: string;
  
  /** Callback when content changes */
  onChange: (content: string) => void;
  
  /** Whether the editor is in read-only mode */
  readOnly?: boolean;
  
  /** Height of the editor (CSS value) */
  height?: string;
  
  /** Placeholder text for empty editor */
  placeholder?: string;
  
  /** Auto-save delay in milliseconds (0 to disable) */
  autoSaveDelay?: number;
  
  /** Callback for auto-save */
  onAutoSave?: (content: string) => void;
  
  /** Available fragments for insertion */
  fragments?: MarkdownFragment[];
  
  /** Show/hide fragment sidebar */
  showFragments?: boolean;
  
  /** Theme for syntax highlighting */
  theme?: "light" | "dark" | "system";
}

export const MarkdownEditor = React.forwardRef<
  { insertFragment: (fragment: MarkdownFragment) => void },
  MarkdownEditorProps
>(({
  content,
  onChange,
  readOnly = false,
  height = "400px",
  placeholder = "Start typing your markdown...",
  autoSaveDelay = 1000,
  onAutoSave,
  fragments = [],
  showFragments = false,
  theme = "light",
}, ref) => {
  const [localContent, setLocalContent] = useState(content);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Helper function to extract text from React children
   */
  const getTextFromChildren = (children: any): string => {
    if (typeof children === 'string') {
      return children;
    }
    
    if (typeof children === 'number') {
      return String(children);
    }
    
    if (Array.isArray(children)) {
      return children.map(getTextFromChildren).join('');
    }
    
    if (React.isValidElement(children)) {
      if (children.props && (children.props as any).children) {
        return getTextFromChildren((children.props as any).children);
      }
      return '';
    }
    
    return String(children || '');
  };

  // Sync local content with prop changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveDelay > 0 && onAutoSave && localContent !== content) {
      // Clear existing timeout
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
      
      // Set new timeout
      autoSaveRef.current = setTimeout(() => {
        onAutoSave(localContent);
      }, autoSaveDelay);
    }

    // Cleanup timeout on unmount
    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [localContent, content, autoSaveDelay, onAutoSave]);

  /**
   * Handle content changes in textarea
   */
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    onChange(newContent);
  }, [onChange]);

  /**
   * Insert fragment at current cursor position
   */
  const insertFragment = useCallback((fragment: MarkdownFragment) => {
    if (!textareaRef.current || readOnly) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newContent = 
      localContent.slice(0, start) + 
      fragment.content + 
      localContent.slice(end);
    
    setLocalContent(newContent);
    onChange(newContent);
    
    // Set cursor position after inserted content
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + fragment.content.length,
        start + fragment.content.length
      );
    }, 0);
  }, [localContent, onChange, readOnly]);

  // Expose insertFragment method to parent components
  React.useImperativeHandle(ref, () => ({
    insertFragment
  }), [insertFragment]);

  /**
   * Toggle between split view and preview-only mode
   */
  const togglePreviewMode = useCallback(() => {
    setIsPreviewMode(!isPreviewMode);
  }, [isPreviewMode]);

  // Custom components for react-markdown with GitHub styling
  const components = {
    // Code blocks and inline code
    code: ({ node, inline, className, children, ...props }: any) => {
      if (inline) {
        // Inline code
        return <code className={styles.inlineCode} {...props}>{children}</code>;
      }
      
      // Block code - extract text content properly
      const match = /language-(\w+)/.exec(className || "");
      const syntaxTheme = theme === "dark" ? oneDark : oneLight;
      
      // Extract the actual code string from children using helper function
      const codeString = getTextFromChildren(children);
      
      if (match && match[1]) {
        return (
          <SyntaxHighlighter
            style={syntaxTheme}
            language={match[1]}
            PreTag="div"
            className={styles.codeBlock}
            showLineNumbers={false}
            wrapLines={false}
            {...props}
          >
            {codeString.replace(/\n$/, "")}
          </SyntaxHighlighter>
        );
      } else {
        return (
          <pre className={styles.preBlock} {...props}>
            <code>{children}</code>
          </pre>
        );
      }
    },
    // Task list items
    input: ({ type, checked, ...props }: any) => {
      if (type === 'checkbox') {
        return <input type="checkbox" checked={checked} disabled className={styles.taskCheckbox} {...props} />;
      }
      return <input {...props} />;
    },
    // Tables
    table: ({ children }: any) => (
      <div className={styles.tableWrapper}>
        <table className={styles.table}>{children}</table>
      </div>
    ),
    // Blockquotes with GitHub alerts support
    blockquote: ({ children, ...props }: any) => {
      // Check if it's a GitHub-style alert
      const childrenString = String(children);
      let alertType = '';
      
      if (childrenString.includes('[!NOTE]')) alertType = 'note';
      else if (childrenString.includes('[!TIP]')) alertType = 'tip';
      else if (childrenString.includes('[!IMPORTANT]')) alertType = 'important';
      else if (childrenString.includes('[!WARNING]')) alertType = 'warning';
      else if (childrenString.includes('[!CAUTION]')) alertType = 'caution';
      
      return (
        <blockquote 
          className={styles.blockquote} 
          data-type={alertType || undefined}
          {...props}
        >
          {children}
        </blockquote>
      );
    },
    // Links with proper styling
    a: ({ href, children, ...props }: any) => (
      <a href={href} className={styles.link} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    ),
    // Images
    img: ({ src, alt, ...props }: any) => (
      <img src={src} alt={alt} className={styles.image} {...props} />
    ),
  };

  return (
    <div className={styles.container} style={{ height }}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <h3>Markdown Editor</h3>
        </div>
        <div className={styles.toolbarRight}>
          <button 
            className={`${styles.toolbarButton} ${isPreviewMode ? styles.active : ""}`}
            onClick={togglePreviewMode}
            title="Toggle preview mode"
          >
            {isPreviewMode ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {/* Main editor area */}
      <div className={styles.editorArea}>
        {/* Fragment sidebar */}
        {showFragments && fragments.length > 0 && (
          <div className={styles.fragmentSidebar}>
            <h4>Fragments</h4>
            <div className={styles.fragmentList}>
              {fragments.map((fragment) => (
                <button
                  key={fragment.id}
                  className={styles.fragmentButton}
                  onClick={() => insertFragment(fragment)}
                  title={fragment.description}
                  disabled={readOnly}
                >
                  <div className={styles.fragmentName}>{fragment.name}</div>
                  <div className={styles.fragmentPreview}>
                    {fragment.preview || fragment.content.substring(0, 30)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Editor and preview */}
        <div className={styles.mainContent}>
          {/* Editor pane */}
          {!isPreviewMode && (
            <div className={styles.editorPane}>
              <textarea
                ref={textareaRef}
                className={styles.textarea}
                value={localContent}
                onChange={handleContentChange}
                placeholder={placeholder}
                readOnly={readOnly}
                spellCheck={false}
              />
            </div>
          )}

          {/* Preview pane */}
          <div className={`${styles.previewPane} ${isPreviewMode ? styles.fullWidth : ""}`}>
            <div className={`${styles.markdownPreview} ${styles.githubMarkdown}`}>
              <ReactMarkdown 
                components={components}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {localContent || "*No content to preview*"}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});