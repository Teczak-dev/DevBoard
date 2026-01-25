/**
 * Language Detection Utilities for DevBoard Code Snippets
 * 
 * This module provides intelligent language detection for code snippets using
 * a combination of highlight.js automatic detection and custom heuristics.
 * 
 * Features:
 * - Automatic language detection using highlight.js
 * - Custom pattern-based heuristics for better accuracy
 * - Special handling for React JSX/TSX components
 * - Support for web formats (HTML, JSON, CSS)
 * - DevOps and database language recognition
 * 
 * The detection system prioritizes accuracy for modern web development
 * languages while maintaining broad compatibility with all supported formats.
 */

import hljs from 'highlight.js';

export interface AutoDetectResult {
  language: string;
  confidence: number;
}

/**
 * Basic language detection using highlight.js automatic detection
 * 
 * Uses highlight.js's built-in highlightAuto function to analyze code
 * and determine the most likely programming language based on syntax patterns.
 * 
 * @param code - Source code to analyze
 * @returns Detection result with language name and confidence score (0-100)
 */
export const detectLanguage = (code: string): AutoDetectResult => {
  if (!code.trim()) {
    return { language: 'plaintext', confidence: 0 };
  }

  try {
    const result = hljs.highlightAuto(code);
    return {
      language: result.language || 'plaintext',
      confidence: result.relevance || 0
    };
  } catch (error) {
    console.warn('Error detecting language:', error);
    return { language: 'plaintext', confidence: 0 };
  }
};

/**
 * Enhanced language detection with custom heuristics for better accuracy
 * 
 * This function uses pattern-based detection for specific formats that
 * highlight.js might not detect accurately, then falls back to the
 * automatic detection for general programming languages.
 * 
 * Special handling for:
 * - HTML documents (DOCTYPE, html tags)
 * - JSON objects and arrays
 * - React JSX/TSX components
 * - Dockerfile commands
 * - SQL queries
 * - TypeScript interfaces and types
 * 
 * @param code - The source code to analyze
 * @returns Detection result with language and confidence score
 */
export const detectLanguageWithHeuristics = (code: string): AutoDetectResult => {
  if (!code.trim()) {
    return { language: 'plaintext', confidence: 0 };
  }

  const trimmedCode = code.trim();
  const lowerCode = trimmedCode.toLowerCase();
  
  // HTML document detection
  if (trimmedCode.startsWith('<!DOCTYPE') || trimmedCode.startsWith('<html')) {
    return { language: 'html', confidence: 95 };
  }
  
  // JSON detection
  if (trimmedCode.startsWith('{') && trimmedCode.endsWith('}')) {
    try {
      JSON.parse(trimmedCode);
      return { language: 'json', confidence: 90 };
    } catch {
      // Could be CSS block or JS object
    }
  }
  
  // React JSX detection
  if (trimmedCode.includes('import React') || 
      trimmedCode.includes('from \'react\'') || 
      trimmedCode.includes('from "react"') ||
      /return\s*\(\s*<[A-Z]/.test(trimmedCode) ||
      /const\s+\w+\s*=\s*\(\)\s*=>\s*</.test(trimmedCode) ||
      /function\s+\w+\s*\([^)]*\)\s*{\s*return\s*</.test(trimmedCode)) {
    
    // Check if it's TypeScript React (TSX)
    if (trimmedCode.includes(': React.') ||
        trimmedCode.includes('interface ') ||
        /:\s*(string|number|boolean|object)\s*[;,}]/.test(trimmedCode) ||
        trimmedCode.includes('type ') ||
        trimmedCode.includes('<T>') ||
        trimmedCode.includes('React.FC')) {
      return { language: 'typescript', confidence: 88 };
    }
    
    return { language: 'javascript', confidence: 85 };
  }
  
  // TypeScript detection (without React)
  if (trimmedCode.includes('interface ') ||
      trimmedCode.includes('type ') ||
      /:\s*(string|number|boolean|object|any|unknown)\s*[;,}=]/.test(trimmedCode) ||
      trimmedCode.includes('as ') ||
      trimmedCode.includes('implements ') ||
      trimmedCode.includes('enum ') ||
      /<T[>,\s]/.test(trimmedCode)) {
    return { language: 'typescript', confidence: 82 };
  }
  
  // Dockerfile detection
  if (trimmedCode.includes('FROM ') && trimmedCode.includes('RUN ')) {
    return { language: 'dockerfile', confidence: 85 };
  }
  
  // SQL detection
  if (lowerCode.includes('select ') || lowerCode.includes('insert ') || 
      lowerCode.includes('update ') || lowerCode.includes('delete ') ||
      lowerCode.includes('create table') || lowerCode.includes('alter table')) {
    return { language: 'sql', confidence: 80 };
  }
  
  // Fallback to highlight.js auto-detect
  return detectLanguage(code);
};

/**
 * Format detection result into human-readable string
 * 
 * Converts the raw detection result into a user-friendly format showing
 * the detected language and confidence level. Used for UI feedback.
 * 
 * Confidence levels:
 * - High: >80 (very likely correct)
 * - Medium: 50-80 (probably correct)  
 * - Low: <50 (uncertain, manual selection recommended)
 * 
 * @param result - Detection result from language detection
 * @returns Formatted string like "javascript (High confidence)"
 */
export const formatDetectionResult = (result: AutoDetectResult): string => {
  if (result.confidence === 0) {
    return 'Unable to detect';
  }
  
  const confidenceText = result.confidence > 80 ? 'High confidence' : 
                        result.confidence > 50 ? 'Medium confidence' : 'Low confidence';
  
  return `${result.language} (${confidenceText})`;
};