import type { Snippet } from "../types/snippet";
import { useState } from "react";

export const useAddSnippet = (
  addSnippet: (snippet: Snippet) => void,
  navigate: (path: string) => void,
) => {
  const [snippetTitle, setSnippetTitle] = useState("");
  const [snippetLanguage, setSnippetLanguage] = useState("");
  const [snippetCode, setSnippetCode] = useState("");

  const handleSnippetTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSnippetTitle(event.target.value);
  };

  const handleSnippetLanguageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSnippetLanguage(event.target.value);
  };

  const handleSnippetCodeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setSnippetCode(event.target.value);
  };

  const handleAddSnippet = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const newSnippet: Snippet = {
      id: 0,
      title: snippetTitle,
      language: snippetLanguage,
      code: snippetCode,
    };
    addSnippet(newSnippet);
    navigate("/snippets");
  };

  return {
    snippetTitle,
    snippetLanguage,
    snippetCode,
    handleSnippetTitleChange,
    handleSnippetLanguageChange,
    handleSnippetCodeChange,
    handleAddSnippet,
  };
};
