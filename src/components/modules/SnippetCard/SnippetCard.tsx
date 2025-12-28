import type { Snippet } from "../../../shared/types/snippet";
import { useState, useRef, useEffect, useMemo } from "react";
import styles from "./Snippet.module.css";
import { useSnippets } from "../../../shared/hooks/useSnippets";
import Popup from "../../organisms/Popup/Popup";

const SnippetCard = ({ snippet }: { snippet: Snippet }) => {
  const { deleteSnippet } = useSnippets();
  const [showCode, setShowCode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // refs to the <pre>, the numbers column and wrapper so we can animate/collapse smoothly
  const codeRef = useRef<HTMLPreElement | null>(null);
  const numbersRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // measured max-height (px) used to animate open/close smoothly.
  // We set this to a pixel value while transitioning, then set to 'none' after open
  // so the content can grow naturally and not be clipped by CSS max-height.
  const [maxHeight, setMaxHeight] = useState<string>("0px");

  // precompute lines for line numbers
  const lines = useMemo(() => {
    // Ensure we always show at least one line
    const arr = snippet.code ? snippet.code.split("\n") : [""];
    return arr;
  }, [snippet.code]);

  const handleShowCode = () => {
    setShowCode((s) => !s);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setShowPopup(true);
  };

  const togglePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className={styles.snippet}>
      {showPopup && (
        <Popup content="📋 copied to clipboard" togglePopup={togglePopup} />
      )}
      <div className={styles.snippetHeader}>
        <h3 className={styles.snippetTitle}>{snippet.title}</h3>
        <div>
          <button
            type="button"
            className={styles.snippetButton}
            onClick={handleCopy}
          >
            Copy
          </button>
          <button
            type="button"
            className={styles.snippetButton}
            onClick={handleShowCode}
            aria-expanded={showCode}
            aria-controls={`snippet-code-${snippet.id}`}
          >
            {showCode ? "Hide" : "Show"}
          </button>
          <button
            type="button"
            className={styles.snippetButton}
            onClick={handleDelete}
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
          >
            {snippet.code}
          </pre>
        </div>
      </div>
    </div>
  );
};
export default SnippetCard;
