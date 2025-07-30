/**
 * Angular HTML Formatter Core Module
 */

import { IndentationOptions } from './types';
import { AngularHtmlTokenizer } from './tokenizer';
import { BlockAnalyzer } from './block-analyzer';

export class AngularHtmlFormatter {
  /**
   * Format Angular HTML content with proper indentation
   */
  static format(input: string, options: IndentationOptions): string {
    if (!input.trim()) {
      return input;
    }

    // Normalize line endings
    const normalizedInput = input
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim();

    const tokens = AngularHtmlTokenizer.tokenize(normalizedInput);

    return this.formatTokens(tokens, options);
  }

  /**
   * Format tokens with proper indentation
   */
  private static formatTokens(tokens: string[], options: IndentationOptions): string {
    const { indentSize, useSpaces } = options;
    const indentChar = useSpaces ? ' ' : '\t';
    const indentUnit = useSpaces ? indentChar.repeat(indentSize) : indentChar;

    let indent = 0;
    const output: string[] = [];

    for (const token of tokens) {
      const trimmedToken = token.trim();

      if (trimmedToken.length === 0) {
        continue;
      }

      // Handle closing blocks first (reduce indentation before adding the line)
      if (BlockAnalyzer.isClosingBlock(trimmedToken)) {
        indent = Math.max(indent - 1, 0);
      }

      // Add the token with current indentation
      output.push(indentUnit.repeat(indent) + trimmedToken);

      // Handle opening blocks (increase indentation after adding the line)
      if (BlockAnalyzer.isOpeningBlock(trimmedToken) && !BlockAnalyzer.isSelfClosingTag(trimmedToken)) {
        indent++;
      }
    }

    return output.join('\n');
  }
}
