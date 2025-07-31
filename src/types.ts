/**
 * Angular HTML Formatter Types
 */

export interface IndentationOptions {
  indentSize: number;
  useSpaces: boolean;
}

export interface FormattingOptions extends IndentationOptions {
  inlineShortElements: boolean;
  shortElementThreshold: number;
  preserveUserMultiline: boolean;
}

export interface TokenizationResult {
  block: string;
  nextIndex: number;
}

export interface IndentationAnalysis {
  indentSize: number;
  useSpaces: boolean;
  totalIndents: number;
}

export interface ElementInfo {
  content: string;
  isMultilineInOriginal: boolean;
  totalLength: number;
  hasComplexAttributes: boolean;
}
