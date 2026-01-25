/**
 * Language constants and utilities for DevBoard snippet management
 * 
 * This module provides comprehensive language support for code snippets including:
 * - Language definitions with display names and highlight.js mappings
 * - Popular languages for quick selection
 * - Color schemes for language badges
 * - Helper functions for language operations
 * 
 * The language system supports both auto-detection and manual selection,
 * with integration to highlight.js for syntax highlighting in the code editor.
 */

export interface LanguageOption {
  value: string;
  label: string;
  hljsName?: string; // highlight.js language name if different from value
}

/**
 * Comprehensive list of supported programming languages and markup formats
 * Each language includes a value (used internally), display label, and optional
 * highlight.js name mapping for accurate syntax highlighting.
 * 
 * Total languages supported: 67 (JavaScript and TypeScript include JSX/TSX support)
 * Categories include:
 * - Popular programming languages (JS with JSX, TS with TSX, Python, Java, etc.)
 * - Additional languages (R, MATLAB, Haskell, etc.)
 * - Web technologies (HTML, CSS, SCSS, etc.)
 * - Data formats (JSON, XML, YAML, etc.)
 * - Documentation formats (Markdown, LaTeX, etc.)
 * - Database languages (SQL, GraphQL)
 * - Shell scripting (Bash, PowerShell, etc.)
 * - DevOps tools (Dockerfile, Terraform, etc.)
 */
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { value: 'auto', label: 'Auto-detect' },
  
  // Popular programming languages
  { value: 'javascript', label: 'JavaScript / JSX', hljsName: 'javascript' },
  { value: 'typescript', label: 'TypeScript / TSX', hljsName: 'typescript' },
  { value: 'python', label: 'Python', hljsName: 'python' },
  { value: 'java', label: 'Java', hljsName: 'java' },
  { value: 'csharp', label: 'C#', hljsName: 'csharp' },
  { value: 'cpp', label: 'C++', hljsName: 'cpp' },
  { value: 'c', label: 'C', hljsName: 'c' },
  { value: 'go', label: 'Go', hljsName: 'go' },
  { value: 'rust', label: 'Rust', hljsName: 'rust' },
  { value: 'php', label: 'PHP', hljsName: 'php' },
  { value: 'ruby', label: 'Ruby', hljsName: 'ruby' },
  { value: 'swift', label: 'Swift', hljsName: 'swift' },
  { value: 'kotlin', label: 'Kotlin', hljsName: 'kotlin' },
  { value: 'dart', label: 'Dart', hljsName: 'dart' },
  { value: 'scala', label: 'Scala', hljsName: 'scala' },
  
  // Additional programming languages
  { value: 'r', label: 'R', hljsName: 'r' },
  { value: 'matlab', label: 'MATLAB', hljsName: 'matlab' },
  { value: 'perl', label: 'Perl', hljsName: 'perl' },
  { value: 'lua', label: 'Lua', hljsName: 'lua' },
  { value: 'haskell', label: 'Haskell', hljsName: 'haskell' },
  { value: 'elixir', label: 'Elixir', hljsName: 'elixir' },
  { value: 'erlang', label: 'Erlang', hljsName: 'erlang' },
  { value: 'clojure', label: 'Clojure', hljsName: 'clojure' },
  { value: 'fsharp', label: 'F#', hljsName: 'fsharp' },
  { value: 'objc', label: 'Objective-C', hljsName: 'objectivec' },
  { value: 'assembly', label: 'Assembly', hljsName: 'x86asm' },
  { value: 'cobol', label: 'COBOL', hljsName: 'cobol' },
  { value: 'fortran', label: 'Fortran', hljsName: 'fortran' },
  { value: 'ada', label: 'Ada', hljsName: 'ada' },
  { value: 'pascal', label: 'Pascal', hljsName: 'pascal' },
  { value: 'vb', label: 'Visual Basic', hljsName: 'vbnet' },
  { value: 'delphi', label: 'Delphi', hljsName: 'delphi' },
  { value: 'groovy', label: 'Groovy', hljsName: 'groovy' },
  { value: 'julia', label: 'Julia', hljsName: 'julia' },
  
  // Web technologies and markup
  { value: 'html', label: 'HTML', hljsName: 'xml' },
  { value: 'css', label: 'CSS', hljsName: 'css' },
  { value: 'scss', label: 'SCSS', hljsName: 'scss' },
  { value: 'sass', label: 'Sass', hljsName: 'sass' },
  { value: 'less', label: 'Less', hljsName: 'less' },
  { value: 'stylus', label: 'Stylus', hljsName: 'stylus' },
  
  // Data formats and configuration
  { value: 'json', label: 'JSON', hljsName: 'json' },
  { value: 'xml', label: 'XML', hljsName: 'xml' },
  { value: 'yaml', label: 'YAML', hljsName: 'yaml' },
  { value: 'toml', label: 'TOML', hljsName: 'ini' },
  { value: 'ini', label: 'INI', hljsName: 'ini' },
  { value: 'properties', label: 'Properties', hljsName: 'properties' },
  
  // Documentation and text
  { value: 'markdown', label: 'Markdown', hljsName: 'markdown' },
  { value: 'latex', label: 'LaTeX', hljsName: 'latex' },
  { value: 'rst', label: 'reStructuredText', hljsName: 'rst' },
  
  // Database and query languages  
  { value: 'sql', label: 'SQL', hljsName: 'sql' },
  { value: 'graphql', label: 'GraphQL', hljsName: 'graphql' },
  
  // Shell and scripting
  { value: 'bash', label: 'Bash', hljsName: 'bash' },
  { value: 'zsh', label: 'Zsh', hljsName: 'zsh' },
  { value: 'fish', label: 'Fish', hljsName: 'fish' },
  { value: 'powershell', label: 'PowerShell', hljsName: 'powershell' },
  { value: 'batch', label: 'Batch', hljsName: 'dos' },
  
  // DevOps and infrastructure
  { value: 'dockerfile', label: 'Dockerfile', hljsName: 'dockerfile' },
  { value: 'terraform', label: 'Terraform', hljsName: 'hcl' },
  { value: 'ansible', label: 'Ansible', hljsName: 'yaml' },
  { value: 'nginx', label: 'Nginx Config', hljsName: 'nginx' },
  { value: 'apache', label: 'Apache Config', hljsName: 'apache' },
  
  // Misc
  { value: 'plaintext', label: 'Plain Text', hljsName: 'plaintext' },
];

/**
 * Helper functions for language operations
 * These utilities provide easy access to language information and mappings
 */

/**
 * Find language option by its value
 * @param value - The language value to search for
 * @returns Language option or undefined if not found
 */
export const getLanguageByValue = (value: string): LanguageOption | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.value === value);
};

/**
 * Get highlight.js language name for syntax highlighting
 * @param value - The language value
 * @returns Highlight.js compatible language name
 */
export const getHljsLanguageName = (value: string): string => {
  const lang = getLanguageByValue(value);
  return lang?.hljsName || value;
};

/**
 * Most popular languages shown at the top of selection lists
 * Ordered by general usage popularity in modern development
 */
export const POPULAR_LANGUAGES = [
  'javascript',
  'typescript', 
  'python',
  'java',
  'csharp',
  'cpp',
  'go',
  'rust',
  'html',
  'css',
  'json'
];

/**
 * Color mapping for language badges in the UI
 * Colors are chosen to be distinctive and match common language associations
 */
export const getLanguageColor = (language: string): string => {
  const colors: Record<string, string> = {
    // Popular languages
    javascript: '#f7df1e',
    typescript: '#3178c6',
    python: '#3776ab',
    java: '#ed8b00',
    csharp: '#239120',
    cpp: '#00599c',
    c: '#a8b9cc',
    go: '#00add8',
    rust: '#ce422b',
    php: '#777bb4',
    ruby: '#cc342d',
    swift: '#fa7343',
    kotlin: '#7f52ff',
    dart: '#0175c2',
    scala: '#dc322f',
    
    // Additional languages
    r: '#276dc3',
    matlab: '#e16737',
    perl: '#39457e',
    lua: '#2c2d72',
    haskell: '#5d4f85',
    elixir: '#6e4a7e',
    erlang: '#b83998',
    clojure: '#5881d8',
    fsharp: '#378bba',
    objc: '#438eff',
    assembly: '#6e4c13',
    cobol: '#1c4e80',
    fortran: '#734f96',
    ada: '#02f88c',
    pascal: '#e3f171',
    vb: '#945db7',
    delphi: '#cc342d',
    groovy: '#e69f56',
    julia: '#9558b2',
    
    // Web technologies
    html: '#e34f26',
    css: '#1572b6',
    scss: '#cf649a',
    sass: '#cf649a',
    less: '#1d365d',
    stylus: '#ff6347',
    
    // Data formats
    json: '#000000',
    xml: '#0060ac',
    yaml: '#cb171e',
    toml: '#9c4221',
    ini: '#427819',
    properties: '#427819',
    
    // Documentation
    markdown: '#083fa1',
    latex: '#008080',
    rst: '#141414',
    
    // Database
    sql: '#336791',
    graphql: '#e10098',
    
    // Shell
    bash: '#4eaa25',
    zsh: '#f15a24',
    fish: '#00d0d0',
    powershell: '#012456',
    batch: '#c1c1c1',
    
    // DevOps
    dockerfile: '#384d54',
    terraform: '#5c4ee5',
    ansible: '#ee0000',
    nginx: '#009639',
    apache: '#d22128',
    
    // Default
    default: 'var(--primary)',
    plaintext: '#6b7280'
  };
  
  return colors[language.toLowerCase()] || colors.default;
};
