import type { Snippet } from "../../../shared/types/snippet";
import { useState, useRef, useEffect, useMemo } from "react";
import styles from "./Snippet.module.css";
import { useSnippets } from "../../../shared/hooks/useSnippets";
import { useNavigate } from "react-router-dom";
import Popup from "../../organisms/Popup/Popup";
import ProjectTags from "../ProjectTags/ProjectTags";
import ProjectSelector from "../ProjectSelector/ProjectSelector";
import hljs from "highlight.js";
import { getLanguageByValue } from "../../../shared/constants/languages";
import { useSnippetExpand } from "../../../shared/contexts/SnippetExpandContext";

const SnippetCard = ({ snippet }: { snippet: Snippet }) => {
  const { deleteSnippet } = useSnippets();
  const navigate = useNavigate();
  
  // Try to get context, fallback to default values if not available
  let expandedSnippets: Set<number>, setExpandedSnippets: (s: Set<number>) => void;
  try {
    const context = useSnippetExpand();
    expandedSnippets = context.expandedSnippets;
    setExpandedSnippets = context.setExpandedSnippets;
  } catch {
    // Fallback when context is not available
    expandedSnippets = new Set();
    setExpandedSnippets = () => {};
  }
  
  const [showPopup, setShowPopup] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  
  // Use context for expand state, fallback to local state if context not available
  const isExpandedFromContext = expandedSnippets.has(snippet.id);
  const [localShowCode, setLocalShowCode] = useState(false);
  
  const showCode = expandedSnippets.size > 0 ? isExpandedFromContext : localShowCode;

  // refs to the <pre>, the numbers column and wrapper so we can animate/collapse smoothly
  const codeRef = useRef<HTMLPreElement | null>(null);
  const numbersRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // measured max-height (px) used to animate open/close smoothly.
  // We set this to a pixel value while transitioning, then set to 'none' after open
  // so the content can grow naturally and not be clipped by CSS max-height.
  const [maxHeight, setMaxHeight] = useState<string>("0px");

  // precompute lines for line numbers and highlighted code
  const { lines, highlightedCode, languageInfo } = useMemo(() => {
    // Ensure we always show at least one line
    const codeLines = snippet.code ? snippet.code.split("\n") : [""];
    
    // Get language information
    const langInfo = getLanguageByValue(snippet.language);
    
    // Highlight the code
    let highlighted: string;
    if (snippet.language && snippet.code) {
      try {
        // Try to highlight with specified language
        highlighted = hljs.highlight(snippet.code, { language: snippet.language.toLowerCase() }).value;
      } catch {
        // Fallback to auto-detection if language is not recognized
        highlighted = hljs.highlightAuto(snippet.code).value;
      }
    } else if (snippet.code) {
      // Auto-detect language if no language specified
      highlighted = hljs.highlightAuto(snippet.code).value;
    } else {
      highlighted = "";
    }
    
    return { 
      lines: codeLines, 
      highlightedCode: highlighted, 
      languageInfo: langInfo || { value: snippet.language, label: snippet.language }
    };
  }, [snippet.code, snippet.language]);

  const handleShowCode = () => {
    if (expandedSnippets.size > 0) {
      // Using context - update the set
      const newExpanded = new Set(expandedSnippets);
      if (isExpandedFromContext) {
        newExpanded.delete(snippet.id);
      } else {
        newExpanded.add(snippet.id);
      }
      setExpandedSnippets(newExpanded);
    } else {
      // Using local state
      setLocalShowCode(!localShowCode);
    }
  };

  useEffect(() => {
    const el = codeRef.current;
    const wrapper = wrapperRef.current;
    if (!el || !wrapper) return;

    const measure = () => {
      // measure the full height of the inner content (pre)
      return el.scrollHeight;
    };

    if (showCode) {
      // opening: set max-height to the measured content height to animate from 0 -> height
      const height = measure();
      setMaxHeight(`${height}px`);
      // after the transition completes we clear maxHeight by setting it to 'none'
      // in the onTransitionEnd handler on the wrapper so the element can size naturally.
    } else {
      // collapsing: first set max-height to the current measured height,
      // then in the next animation frame set it to 0 so we get a smooth collapse.
      const height = measure();
      setMaxHeight(`${height}px`);
      // collapse on next frame to trigger the transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setMaxHeight("0px");
        });
      });
    }
  }, [showCode, snippet.code]);

  // scroll sync: when user scrolls the code block, sync numbers' scrollTop and vice-versa
  const onCodeScroll = () => {
    const codeEl = codeRef.current;
    const numsEl = numbersRef.current;
    if (!codeEl || !numsEl) return;
    // sync vertical
    if (numsEl.scrollTop !== codeEl.scrollTop) {
      numsEl.scrollTop = codeEl.scrollTop;
    }
  };

  const onNumbersScroll = () => {
    const codeEl = codeRef.current;
    const numsEl = numbersRef.current;
    if (!codeEl || !numsEl) return;
    if (codeEl.scrollTop !== numsEl.scrollTop) {
      codeEl.scrollTop = numsEl.scrollTop;
    }
  };

  const handleDelete = () => {
    deleteSnippet(snippet.id);
  };

  const handleEdit = () => {
    // Navigate to edit page
    navigate(`/edit-snippet/${snippet.id}`);
  };

  const handleManageProjects = () => {
    setShowProjectSelector(!showProjectSelector);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setShowPopup(true);
  };

  const togglePopup = () => {
    setShowPopup(false);
  };

  // Get language color for the badge
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
    <div className={styles.snippet}>
      {showPopup && (
        <Popup content="Copied to clipboard" togglePopup={togglePopup} />
      )}
      <div className={styles.snippetHeader}>
        <div className={styles.snippetTitleSection}>
          <h3 className={styles.snippetTitle}>{snippet.title}</h3>
          <div className={styles.snippetMeta}>
            <span 
              className={styles.languageBadge}
              style={{ 
                '--badge-color': getLanguageColor(snippet.language),
                backgroundColor: getLanguageColor(snippet.language) + '20',
                color: getLanguageColor(snippet.language),
                border: `1px solid ${getLanguageColor(snippet.language)}40`
              } as React.CSSProperties}
            >
              {languageInfo.label}
            </span>
            <span className={styles.codeLength}>
              {snippet.code.split('\n').length} lines
            </span>
          </div>
          <ProjectTags snippetId={snippet.id} />
        </div>
        <div className={styles.snippetActions}>
          <button
            type="button"
            className={styles.snippetButton}
            onClick={handleManageProjects}
            title="Manage projects"
          >
            Projects
          </button>
          <button
            type="button"
            className={styles.snippetButton}
            onClick={handleEdit}
            title="Edit snippet"
          >
            Edit
          </button>
          <button
            type="button"
            className={styles.snippetButton}
            onClick={handleCopy}
            title="Copy code to clipboard"
          >
            Copy
          </button>
          <button
            type="button"
            className={styles.snippetButton}
            onClick={handleShowCode}
            aria-expanded={showCode}
            aria-controls={`snippet-code-${snippet.id}`}
            title={showCode ? "Hide code" : "Show code"}
          >
            {showCode ? "Hide" : "Show"}
          </button>
          <button
            type="button"
            className={`${styles.snippetButton} ${styles.deleteButton}`}
            onClick={handleDelete}
            title="Delete snippet"
          >
            Delete
          </button>
        </div>
      </div>

      {/* content wrapper: contains numbers column + code block side-by-side */}
      <div
        ref={wrapperRef}
        className={`${styles.snippetContent} ${showCode ? styles.open : ""}`}
        aria-hidden={!showCode}
        onTransitionEnd={(e) => {
          // when opening finished, allow natural height so content isn't clipped by CSS max-height
          if (showCode && e.propertyName === "max-height") {
            // ensure wrapper is visible and no longer constrained by max-height
            const w = wrapperRef.current;
            if (w) {
              w.style.overflow = "visible";
            }
            setMaxHeight("none");
          }
        }}
        style={{
          maxHeight: maxHeight,
          overflow: "hidden",
          transition: "max-height 300ms ease",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
          }}
        >
          {/* Line numbers column */}
          <div
            ref={numbersRef}
            // allow user to scroll numbers column too (keeps sync)
            onScroll={onNumbersScroll}
            style={{
              width: "3.2rem",
              minWidth: "3.2rem",
              textAlign: "right",
              color: "var(--muted, #888)",
              fontFamily: "Menlo, Monaco, Consolas, 'Courier New', monospace",
              fontSize: "0.9rem",
              lineHeight: "1.5",
              paddingTop: "0.5rem",
              paddingRight: "8px",
              overflow: showCode ? "auto" : "hidden",
              boxSizing: "border-box",
              userSelect: "none",
            }}
            aria-hidden={!showCode}
          >
            {lines.map((_, i) => (
              <div key={i} style={{ padding: "0 4px" }}>
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code block */}
          <pre
            id={`snippet-code-${snippet.id}`}
            ref={codeRef}
            className={styles.snippetCode}
            onScroll={onCodeScroll}
            // the wrapper handles the open/close max-height animation. Here we override
            // the CSS max-height (if present) when the snippet is open so the <pre> won't
            // clip the content. When closed we keep overflow hidden.
            style={{
              maxHeight: showCode ? "none" : undefined,
              overflow: showCode ? "auto" : "hidden",
              whiteSpace: "pre",
              boxSizing: "border-box",
              margin: 0,
              flex: 1,
            }}
            aria-hidden={!showCode}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </div>
      </div>
      
      {/* Project Selector */}
      {showProjectSelector && (
        <div className={styles.projectSelectorWrapper}>
          <ProjectSelector 
            snippetId={snippet.id} 
            onClose={() => setShowProjectSelector(false)} 
          />
        </div>
      )}
    </div>
  );
};
export default SnippetCard;
