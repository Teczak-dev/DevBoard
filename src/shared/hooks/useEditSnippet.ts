import type { Snippet } from "../types/snippet";
import { useState, useEffect, useMemo, useCallback } from "react";
import { detectLanguageWithHeuristics, type AutoDetectResult } from "../utils/languageDetection";

export const useEditSnippet = (
  snippet: Snippet | undefined,
  updateSnippet: (id: number, snippet: Snippet) => Promise<void>,
  navigate: (path: string) => void,
) => {
  const [snippetTitle, setSnippetTitle] = useState("");
  const [snippetLanguage, setSnippetLanguage] = useState("auto");
  const [snippetCode, setSnippetCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with snippet data
  useEffect(() => {
    if (snippet) {
      setSnippetTitle(snippet.title);
      setSnippetLanguage(snippet.language);
      setSnippetCode(snippet.code);
    }
  }, [snippet]);

  // Auto-detect language when code changes (using useMemo to avoid effect)
  const autoDetectResult = useMemo((): AutoDetectResult | null => {
    if (snippetCode.trim()) {
      return detectLanguageWithHeuristics(snippetCode);
    }
    return null;
  }, [snippetCode]);

  const handleSnippetTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSnippetTitle(event.target.value);
  };

  const handleSnippetLanguageChange = (value: string) => {
    setSnippetLanguage(value);
  };

  const handleSnippetCodeChange = (value: string) => {
    setSnippetCode(value);
  };

  const handleUpdateSnippet = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    if (!snippet || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Determine final language
      let finalLanguage = snippetLanguage;
      if (snippetLanguage === 'auto' && autoDetectResult) {
        finalLanguage = autoDetectResult.language;
      }
      
      const updatedSnippet: Snippet = {
        ...snippet,
        title: snippetTitle,
        language: finalLanguage,
        code: snippetCode,
      };
      
      await updateSnippet(snippet.id, updatedSnippet);
      navigate("/snippets");
    } catch (error) {
      console.error('Error updating snippet:', error);
    } finally {
      setIsLoading(false);
    }
  }, [snippet, snippetTitle, snippetLanguage, snippetCode, autoDetectResult, updateSnippet, navigate, isLoading]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      if (snippetTitle.trim() && snippetCode.trim() && !isLoading) {
        handleUpdateSnippet({ preventDefault: () => {} } as React.MouseEvent<HTMLButtonElement>);
      }
    }
  }, [snippetTitle, snippetCode, handleUpdateSnippet, isLoading]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    snippetTitle,
    snippetLanguage,
    snippetCode,
    autoDetectResult,
    isLoading,
    handleSnippetTitleChange,
    handleSnippetLanguageChange,
    handleSnippetCodeChange,
    handleUpdateSnippet,
  };
};