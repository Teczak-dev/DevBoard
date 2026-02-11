/**
 * Fragment interface for markdown template system
 * 
 * Represents reusable markdown snippets/templates that can be 
 * inserted into the markdown editor for faster content creation.
 */
export interface MarkdownFragment {
  /** Unique identifier for the fragment */
  id: number;
  
  /** Fragment name/title for display */
  name: string;
  
  /** Fragment category for organization */
  category: "header" | "text" | "code" | "list" | "table" | "media" | "custom";
  
  /** The markdown content of the fragment */
  content: string;
  
  /** Optional description of what this fragment does */
  description?: string;
  
  /** Whether this is a built-in system fragment or user-created */
  isBuiltIn: boolean;
  
  /** Optional preview text for UI display */
  preview?: string;
  
  /** Creation timestamp */
  createdAt: Date;
  
  /** Last modified timestamp */
  updatedAt: Date;
}

/**
 * Fragment category definitions for better organization
 */
export const FRAGMENT_CATEGORIES = {
  header: "Headers",
  text: "Text Formatting", 
  code: "Code Blocks",
  list: "Lists & Tables",
  table: "Tables",
  media: "Media & Links",
  custom: "Custom"
} as const;

/**
 * Built-in fragment templates that come with the system
 */
export const BUILT_IN_FRAGMENTS: Omit<MarkdownFragment, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "H1 Header",
    category: "header",
    content: "# Header Text",
    description: "Main page header",
    isBuiltIn: true,
    preview: "# Header Text"
  },
  {
    name: "H2 Header", 
    category: "header",
    content: "## Header Text",
    description: "Section header",
    isBuiltIn: true,
    preview: "## Header Text"
  },
  {
    name: "H3 Header",
    category: "header", 
    content: "### Header Text",
    description: "Subsection header",
    isBuiltIn: true,
    preview: "### Header Text"
  },
  {
    name: "Code Block",
    category: "code",
    content: "```javascript\n// Your code here\nconsole.log('Hello World');\nlet a = 2;\n```",
    description: "Syntax highlighted code block",
    isBuiltIn: true,
    preview: "```js\nconsole.log('Hello');\n```"
  },
  {
    name: "Python Code",
    category: "code",
    content: "```python\n# Python code example\ndef hello_world():\n    print('Hello World!')\n    return True\n```",
    description: "Python code block",
    isBuiltIn: true,
    preview: "```py\nprint('Hello')\n```"
  },
  {
    name: "TypeScript Code",
    category: "code",
    content: "```typescript\n// TypeScript code example\ninterface User {\n  id: number;\n  name: string;\n}\n\nconst user: User = {\n  id: 1,\n  name: 'John'\n};\n```",
    description: "TypeScript code block",
    isBuiltIn: true,
    preview: "```ts\ninterface User {}\n```"
  },
  {
    name: "CSS Code",
    category: "code",
    content: "```css\n/* CSS styling */\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n```",
    description: "CSS code block",
    isBuiltIn: true,
    preview: "```css\n.container {}\n```"
  },
  {
    name: "Inline Code",
    category: "code", 
    content: "`code here`",
    description: "Inline code snippet",
    isBuiltIn: true,
    preview: "`code here`"
  },
  {
    name: "Bulleted List",
    category: "list",
    content: "- Item 1\n- Item 2\n- Item 3",
    description: "Unordered list with bullets",
    isBuiltIn: true,
    preview: "- Item 1\n- Item 2"
  },
  {
    name: "Numbered List", 
    category: "list",
    content: "1. First item\n2. Second item\n3. Third item",
    description: "Ordered numbered list", 
    isBuiltIn: true,
    preview: "1. First item\n2. Second item"
  },
  {
    name: "Task List",
    category: "list",
    content: "- [ ] Todo item\n- [x] Completed item\n- [ ] Another todo",
    description: "Checkbox todo list",
    isBuiltIn: true,
    preview: "- [ ] Todo item\n- [x] Done"
  },
  {
    name: "Simple Table",
    category: "table",
    content: "| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |",
    description: "Basic 3-column table",
    isBuiltIn: true,
    preview: "| Col1 | Col2 | Col3 |"
  },
  {
    name: "Link",
    category: "media",
    content: "[Link text](https://example.com)",
    description: "External link",
    isBuiltIn: true,
    preview: "[Link text](url)"
  },
  {
    name: "Image",
    category: "media", 
    content: "![Alt text](image-url.jpg)",
    description: "Embedded image",
    isBuiltIn: true,
    preview: "![Alt text](image.jpg)"
  },
  {
    name: "Blockquote",
    category: "text",
    content: "> This is a blockquote\n> It can span multiple lines",
    description: "Quote or callout text",
    isBuiltIn: true,
    preview: "> Blockquote text"
  },
  {
    name: "Bold Text",
    category: "text",
    content: "**bold text**",
    description: "Bold formatting",
    isBuiltIn: true,
    preview: "**bold text**"
  },
  {
    name: "Italic Text",
    category: "text", 
    content: "*italic text*",
    description: "Italic formatting",
    isBuiltIn: true,
    preview: "*italic text*"
  },
  {
    name: "Horizontal Rule",
    category: "text",
    content: "---",
    description: "Horizontal divider line",
    isBuiltIn: true, 
    preview: "---"
  },
  {
    name: "Strikethrough",
    category: "text",
    content: "~~strikethrough text~~",
    description: "Text with strikethrough formatting",
    isBuiltIn: true,
    preview: "~~strikethrough~~"
  },
  {
    name: "GitHub Alert",
    category: "text", 
    content: "> [!NOTE]\n> This is a note",
    description: "GitHub-style alert callout",
    isBuiltIn: true,
    preview: "> [!NOTE] Alert"
  },
  {
    name: "GitHub Warning",
    category: "text",
    content: "> [!WARNING]\n> This is a warning",
    description: "GitHub-style warning callout", 
    isBuiltIn: true,
    preview: "> [!WARNING] Warning"
  },
  {
    name: "Footnote",
    category: "text",
    content: "Here's a sentence with a footnote[^1].\n\n[^1]: This is the footnote.",
    description: "Footnote reference and definition",
    isBuiltIn: true,
    preview: "Text[^1]"
  },
  {
    name: "Definition List",
    category: "list",
    content: "Term 1\n: Definition 1\n\nTerm 2\n: Definition 2",
    description: "Definition list with terms and descriptions",
    isBuiltIn: true,
    preview: "Term 1\n: Definition"
  },
  {
    name: "Keyboard Key",
    category: "text",
    content: "Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to copy",
    description: "Keyboard key styling",
    isBuiltIn: true,
    preview: "<kbd>Ctrl</kbd>+<kbd>C</kbd>"
  },
  {
    name: "Math Inline",
    category: "text", 
    content: "When $a \\ne 0$, there are two solutions",
    description: "Inline mathematical expression",
    isBuiltIn: true,
    preview: "$a \\ne 0$"
  },
  {
    name: "Math Block",
    category: "text",
    content: "$$\n\\sum_{i=1}^{n} x_i = x_1 + x_2 + ... + x_n\n$$",
    description: "Block mathematical expression",
    isBuiltIn: true,
    preview: "$$\\sum_{i=1}^{n} x_i$$"
  },
  {
    name: "Mermaid Diagram",
    category: "media",
    content: "```mermaid\ngraph TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action]\n    B -->|No| D[End]\n```",
    description: "Mermaid diagram/flowchart",
    isBuiltIn: true,
    preview: "```mermaid\ngraph TD..."
  }
];