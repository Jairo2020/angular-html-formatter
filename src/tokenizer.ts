/**
 * Angular HTML Tokenizer Module
 */

import { TokenizationResult } from "./types";

export class AngularHtmlTokenizer {
  private static readonly ANGULAR_KEYWORDS = [
    "if", "else", "for", "switch", "case", "default",
    "defer", "loading", "error", "placeholder"
  ];

  /**
   * Tokenize Angular HTML content into processable tokens
   */
  static tokenize(input: string): string[] {
    const tokens: string[] = [];
    let currentToken = "";
    let i = 0;

    while (i < input.length) {
      const char = input[i];

      if (this.shouldProcessAsAngularInterpolation(input, i)) {
        tokens.push(...this.processCurrentToken(currentToken));
        currentToken = "";

        const interpolationResult = this.extractAngularInterpolation(input, i);
        tokens.push(interpolationResult.block);
        i = interpolationResult.nextIndex;
      } else if (this.shouldProcessAsAngularBlock(input, i)) {
        tokens.push(...this.processCurrentToken(currentToken));
        currentToken = "";

        const blockResult = this.extractAngularBlock(input, i);
        tokens.push(blockResult.block);
        i = blockResult.nextIndex;
      } else if (this.shouldProcessAsClosingBrace(input, i)) {
        tokens.push(...this.processCurrentToken(currentToken));
        currentToken = "";
        tokens.push("}");
        i++;
      } else if (this.shouldProcessAsHtmlTag(input, i)) {
        tokens.push(...this.processCurrentToken(currentToken));
        currentToken = "";

        const tagResult = this.extractHtmlTag(input, i);
        tokens.push(tagResult.block);
        i = tagResult.nextIndex;
      } else {
        // Include line breaks and other characters in the current token
        // This allows text content to accumulate properly
        currentToken += char;
        i++;
      }
    }

    tokens.push(...this.processCurrentToken(currentToken));
    return tokens.filter(token => token.length > 0);
  }

  private static shouldProcessAsAngularBlock(input: string, index: number): boolean {
    return input[index] === "@" && this.isAngularControlStart(input, index);
  }

  /**
   * Updated shouldProcessAsClosingBrace to ignore }} from interpolations
   */
  private static shouldProcessAsClosingBrace(input: string, index: number): boolean {
    // Don't process }} as closing brace if it's part of interpolation
    if (input[index] === "}" && index > 0 && input[index - 1] === "}") {
      return false;
    }

    return input[index] === "}" && !(index > 0 && input[index - 1] === "@");
  }

  private static shouldProcessAsHtmlTag(input: string, index: number): boolean {
    return input[index] === "<";
  }

  private static isLineBreak(char: string): boolean {
    return char === "\n" || char === "\r";
  }

  private static processCurrentToken(token: string): string[] {
    // Don't trim text content aggressively, just remove empty strings
    if (!token || token.trim().length === 0) {
      return [];
    }

    // If it's likely text content (doesn't start with < or @), preserve more spacing
    if (!token.trim().startsWith('<') && !token.trim().startsWith('@') && !token.trim().startsWith('}')) {
      // Only collapse multiple spaces/newlines to single spaces, but preserve the content
      const cleaned = token.replace(/\s+/g, ' ');
      return cleaned.trim() ? [cleaned.trim()] : [];
    }

    // For HTML tags and Angular blocks, trim normally
    const trimmed = token.trim();
    return trimmed ? [trimmed] : [];
  }

  private static isAngularControlStart(input: string, index: number): boolean {
    for (const keyword of this.ANGULAR_KEYWORDS) {
      if (input.substring(index).startsWith("@" + keyword)) {
        return true;
      }
    }
    return input.substring(index).startsWith("@}");
  }

  private static extractAngularBlock(input: string, startIndex: number): TokenizationResult {
    let i = startIndex;

    if (input.substring(i).startsWith("@}")) {
      return { block: "@}", nextIndex: i + 2 };
    }

    while (i < input.length && input[i] !== "{") {
      i++;
    }

    if (i < input.length && input[i] === "{") {
      const block = input.substring(startIndex, i + 1).trim();
      return { block, nextIndex: i + 1 };
    }

    const block = input.substring(startIndex, i).trim();
    return { block, nextIndex: i };
  }

  private static extractHtmlTag(input: string, startIndex: number): TokenizationResult {
    let i = startIndex;
    let inSingleQuotes = false;
    let inDoubleQuotes = false;

    while (i < input.length) {
      const char = input[i];
      const prevChar = i > 0 ? input[i - 1] : '';

      // Handle quote states
      if (char === "'" && !inDoubleQuotes && prevChar !== '\\') {
        inSingleQuotes = !inSingleQuotes;
      } else if (char === '"' && !inSingleQuotes && prevChar !== '\\') {
        inDoubleQuotes = !inDoubleQuotes;
      }

      // Only break on > when we're not inside quotes
      if (char === ">" && !inSingleQuotes && !inDoubleQuotes) {
        const block = input.substring(startIndex, i + 1);
        return { block, nextIndex: i + 1 };
      }

      i++;
    }

    // If we reach here, we didn't find a closing >
    const block = input.substring(startIndex, i);
    return { block, nextIndex: i };
  }

  /**
   * Check if current position starts an Angular interpolation {{ }}
   */
  private static shouldProcessAsAngularInterpolation(input: string, index: number): boolean {
    return input.substring(index, index + 2) === "{{";
  }

  /**
   * Extract Angular interpolation {{ expression }}
   */
  private static extractAngularInterpolation(input: string, startIndex: number): TokenizationResult {
    let i = startIndex + 2; // Skip the initial {{
    let braceCount = 1;

    while (i < input.length && braceCount > 0) {
      if (input.substring(i, i + 2) === "{{") {
        braceCount++;
        i += 2;
      } else if (input.substring(i, i + 2) === "}}") {
        braceCount--;
        i += 2;
      } else {
        i++;
      }
    }

    // Extract the complete interpolation
    const block = input.substring(startIndex, i);
    return { block, nextIndex: i };
  }
}