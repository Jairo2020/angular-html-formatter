/**
 * Angular HTML Formatter Types
 */

export interface IndentationOptions {
  indentSize: number;
  useSpaces: boolean;
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
