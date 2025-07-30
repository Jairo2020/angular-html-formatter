/**
 * Indentation Detection and Configuration Module
 */

import * as vscode from 'vscode';
import { IndentationOptions, IndentationAnalysis } from './types';

export class IndentationDetector {
  private static readonly REASONABLE_INDENT_SIZES = [2, 3, 4, 6, 8];
  private static readonly MAX_LINES_TO_ANALYZE = 1000;

  /**
   * Get indentation options from VS Code configuration and document analysis
   */
  static getIndentationOptions(document: vscode.TextDocument): IndentationOptions {
    const config = vscode.workspace.getConfiguration('editor', document.uri);

    const insertSpaces = config.get<boolean>('insertSpaces', true);
    const tabSize = config.get<number>('tabSize', 4);
    const detectIndentation = config.get<boolean>('detectIndentation', true);

    let indentSize = tabSize;
    let useSpaces = insertSpaces;

    if (detectIndentation) {
      const detected = this.detectFromDocument(document);
      if (detected) {
        indentSize = detected.indentSize;
        useSpaces = detected.useSpaces;
      }
    }

    return { indentSize, useSpaces };
  }

  /**
   * Detect indentation from document content
   */
  private static detectFromDocument(document: vscode.TextDocument): IndentationOptions | null {
    const text = document.getText();
    const lines = text.split('\n').slice(0, this.MAX_LINES_TO_ANALYZE);

    const analysis = this.analyzeIndentation(lines);

    if (analysis.totalIndents === 0) {
      return null;
    }

    return {
      indentSize: analysis.indentSize,
      useSpaces: analysis.useSpaces
    };
  }

  /**
   * Analyze indentation patterns in lines
   */
  private static analyzeIndentation(lines: string[]): IndentationAnalysis {
    let spaceIndents = 0;
    let tabIndents = 0;
    const spaceSizes: number[] = [];
    const indentPattern = /^(\s+)/;

    for (const line of lines) {
      if (line.trim().length === 0) continue;

      const match = indentPattern.exec(line);
      if (match) {
        const indentStr = match[1];

        if (indentStr.includes('\t')) {
          tabIndents++;
        } else if (indentStr.includes(' ')) {
          spaceIndents++;
          spaceSizes.push(indentStr.length);
        }
      }
    }

    const useSpaces = spaceIndents >= tabIndents;
    const indentSize = this.determineIndentSize(spaceSizes, useSpaces);

    return {
      indentSize,
      useSpaces,
      totalIndents: spaceIndents + tabIndents
    };
  }

  /**
   * Determine the most likely indent size from space patterns
   */
  private static determineIndentSize(spaceSizes: number[], useSpaces: boolean): number {
    if (!useSpaces || spaceSizes.length === 0) {
      return 4; // Default tab size
    }

    const sizeCounts = new Map<number, number>();
    for (const size of spaceSizes) {
      sizeCounts.set(size, (sizeCounts.get(size) || 0) + 1);
    }

    let bestSize = 4;
    let maxCount = 0;

    for (const size of this.REASONABLE_INDENT_SIZES) {
      const count = sizeCounts.get(size) || 0;
      if (count > maxCount) {
        maxCount = count;
        bestSize = size;
      }
    }

    return bestSize;
  }
}
