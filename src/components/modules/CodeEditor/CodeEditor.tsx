import React, { useRef, useEffect, useMemo } from 'react';
import hljs from 'highlight.js';
import { getHljsLanguageName } from '../../../shared/constants/languages';
import styles from './CodeEditor.module.css';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  placeholder = 'Enter your code here...'
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);

  // Highlighted code using highlight.js
  const highlightedCode = useMemo(() => {
    if (!value.trim()) return '';
    
    try {
      if (language === 'auto' || language === 'plaintext') {
        return hljs.highlightAuto(value).value;
      } else {
        const hljsLang = getHljsLanguageName(language);
        return hljs.highlight(value, { language: hljsLang }).value;
      }
    } catch {
      // Fallback to auto-detection if language not supported
      return hljs.highlightAuto(value).value;
    }
  }, [value, language]);

  // calculate line numbers
  const lines = useMemo(() => {
    return value ? value.split('\n') : [''];
  }, [value]);

  // Sync scroll positions between textarea and highlight overlay 
  const syncScroll = () => {
    const textarea = textareaRef.current;
    const pre = preRef.current;
    const numbers = numbersRef.current;
    
    if (textarea && pre && numbers) {
      pre.scrollTop = textarea.scrollTop;
      pre.scrollLeft = textarea.scrollLeft;
      numbers.scrollTop = textarea.scrollTop;
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    
    // Tab handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
    
    // Auto-indentation on Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLine = value.substring(lineStart, start);
      const indentMatch = currentLine.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : '';
      
      const newValue = value.substring(0, start) + '\n' + indent + value.substring(start);
      onChange(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length;
      }, 0);
    }
  };

  // Auto-resize textarea and sync line numbers
  useEffect(() => {
    const textarea = textareaRef.current;
    const numbers = numbersRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(200, textarea.scrollHeight) + 'px';
      
      // Force line numbers to update
      if (numbers) {
        numbers.scrollTop = textarea.scrollTop;
      }
    }
  }, [value, lines.length]);

  return (
    <div className={styles.container}>
      <div className={styles.editor}>
        {/* Line numbers */}
        <div 
          ref={numbersRef}
          className={styles.lineNumbers}
          aria-hidden="true"
        >
          {lines.map((_, index) => (
            <div key={index} className={styles.lineNumber}>
              {index + 1}
            </div>
          ))}
        </div>

        {/* Code highlight overlay */}
        <pre 
          ref={preRef}
          className={styles.highlight}
          aria-hidden="true"
        >
          <code dangerouslySetInnerHTML={{ __html: highlightedCode + '\n' }} />
        </pre>

        {/* Input textarea */}
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          placeholder={placeholder}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>
    </div>
  );
};

export default CodeEditor;
