import { createContext } from "react";
import type { Snippet } from "../shared/types/snippet";

export interface SnippetsContextType {
  snippets: Snippet[];
  updateSnippets: (value: Snippet[]) => void;
  updateSnippet: (id: number, snippet: Snippet) => void;
  addSnippet: (snippet: Snippet) => void;
  deleteSnippet: (id: number) => void;
}

export const SnippetsContext = createContext<SnippetsContextType | null>(null);
