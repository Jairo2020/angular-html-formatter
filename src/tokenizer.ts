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

      if (this.shouldProcessAsAngularBlock(input, i)) {
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
      } else if (this.isLineBreak(char)) {
        tokens.push(...this.processCurrentToken(currentToken));
        currentToken = "";
        i++;
      } else {
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

  private static shouldProcessAsClosingBrace(input: string, index: number): boolean {
    return input[index] === "}" && !(index > 0 && input[index - 1] === "@");
  }

  private static shouldProcessAsHtmlTag(input: string, index: number): boolean {
    return input[index] === "<";
  }

  private static isLineBreak(char: string): boolean {
    return char === "\n" || char === "\r";
  }

  private static processCurrentToken(token: string): string[] {
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

    while (i < input.length && input[i] !== ">") {
      i++;
    }

    if (i < input.length && input[i] === ">") {
      const block = input.substring(startIndex, i + 1);
      return { block, nextIndex: i + 1 };
    }

    const block = input.substring(startIndex, i);
    return { block, nextIndex: i };
  }
}