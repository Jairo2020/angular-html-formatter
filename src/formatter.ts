/**
 * Angular HTML Formatter Core Module
 * 
 * A comprehensive formatter for Angular HTML templates with support for:
 * - Angular 17+ control flow (@if, @for, @switch, etc.)
 * - Smart inline element handling
 * - Intelligent interpolation formatting
 * - Quote-aware operator formatting
 */

import { FormattingOptions, ElementInfo } from './types';
import { AngularHtmlTokenizer } from './tokenizer';
import { BlockAnalyzer } from './block-analyzer';

/**
 * Main formatter class for Angular HTML templates
 */
export class AngularHtmlFormatter {
  /**
   * Format Angular HTML content with proper indentation
   */
  static format(input: string, options: FormattingOptions): string {
    if (!input.trim()) {
      return input;
    }

    // Normalize line endings
    const normalizedInput = input
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim();

    const tokens = AngularHtmlTokenizer.tokenize(normalizedInput);

    return this.formatTokens(tokens, options, normalizedInput);
  }

  /**
   * Check if an element should be kept inline
   */
  private static shouldKeepInline(element: string, options: FormattingOptions, originalContent: string): boolean {
    if (!options.inlineShortElements) {
      return false;
    }

    // Always respect user's original formatting if preserveUserMultiline is enabled
    if (options.preserveUserMultiline && this.wasOriginallyMultiline(element, originalContent)) {
      return false;
    }

    const elementInfo = this.analyzeElement(element);

    // Extract tag name for special handling
    const tagRegex = /<(\w+)/;
    const tagMatch = tagRegex.exec(element);
    const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';

    // For simple elements with minimal content, be more permissive
    const inlineElements = ['p', 'span', 'a', 'strong', 'em', 'b', 'i', 'small', 'label', 'button', 'li'];
    const isInlineElement = inlineElements.includes(tagName);

    // If it's a simple element without nested tags and reasonable length, keep inline
    const hasNestedTags = /<\w+/.test(element.substring(element.indexOf('>') + 1, element.lastIndexOf('<')));

    // Check if this element was originally compact (no spaces around content)
    const wasOriginallyCompact = this.wasElementOriginallyCompact(element, originalContent);

    if (isInlineElement && !hasNestedTags && elementInfo.totalLength <= options.shortElementThreshold) {
      return true;
    }

    // Also keep inline if it was originally compact, regardless of length (within reason)
    if (wasOriginallyCompact && elementInfo.totalLength <= options.shortElementThreshold * 1.5) {
      return true;
    }

    // For other elements, use stricter criteria
    return elementInfo.totalLength <= (options.shortElementThreshold / 2) && !elementInfo.hasComplexAttributes;
  }

  /**
   * Check if element was originally on multiple lines intentionally by the user
   */
  private static wasOriginallyMultiline(element: string, originalContent: string): boolean {
    const elementRegex = /<[^>]+>/;
    const elementMatch = elementRegex.exec(element);
    if (!elementMatch) return false;

    const elementStart = elementMatch[0];
    const index = originalContent.indexOf(elementStart);
    if (index === -1) return false;

    // Look for the complete element in original content
    const tagRegex = /<(\w+)/;
    const tagMatch = tagRegex.exec(element);
    if (!tagMatch) return false;

    const tagName = tagMatch[1];
    const endTag = `</${tagName}>`;
    const endIndex = originalContent.indexOf(endTag, index);
    if (endIndex === -1) return false;

    const originalElement = originalContent.substring(index, endIndex + endTag.length);

    // Only consider it "intentionally multiline" if it has structured content
    // (like nested elements), not just text that was wrapped
    const hasNestedElements = /<\w+/.test(originalElement.substring(elementStart.length, -endTag.length));

    return originalElement.includes('\n') && hasNestedElements;
  }

  /**
   * Check if element was originally written in compact form (no spaces around content)
   */
  private static wasElementOriginallyCompact(element: string, originalContent: string): boolean {
    const tagInfo = this.extractTagInfo(element);
    if (!tagInfo) return false;

    // Try direct pattern matching first
    const directMatch = this.findDirectElementMatch(element, originalContent);
    if (directMatch.found) {
      return this.isContentCompact(directMatch.content);
    }

    // Fall back to similar pattern matching
    return this.findSimilarElementMatch(tagInfo.tagName, element, originalContent);
  }

  /**
   * Extract tag information from element
   */
  private static extractTagInfo(element: string): { tagName: string } | null {
    const tagRegex = /<(\w+)/;
    const tagMatch = tagRegex.exec(element);
    return tagMatch ? { tagName: tagMatch[1] } : null;
  }

  /**
   * Find direct element match in original content
   */
  private static findDirectElementMatch(element: string, originalContent: string): {
    found: boolean;
    content: string;
  } {
    const elementPattern = element
      .replace(/\s+/g, '\\s*')
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const regex = new RegExp(elementPattern, 'i');
    const match = regex.exec(originalContent);

    if (match) {
      const originalElement = match[0];
      const contentStart = originalElement.indexOf('>') + 1;
      const contentEnd = originalElement.lastIndexOf('<');

      if (contentStart < contentEnd) {
        const content = originalElement.substring(contentStart, contentEnd);
        return { found: true, content };
      }
    }

    return { found: false, content: '' };
  }

  /**
   * Find similar element match using tag name
   */
  private static findSimilarElementMatch(tagName: string, element: string, originalContent: string): boolean {
    const openingTagRegex = new RegExp(`<${tagName}[^>]*>`, 'g');
    const closingTag = `</${tagName}>`;

    let searchMatch;
    while ((searchMatch = openingTagRegex.exec(originalContent)) !== null) {
      const matchResult = this.processSimilarMatch(searchMatch, closingTag, element, originalContent);
      if (matchResult.found) {
        return matchResult.isCompact;
      }
    }

    return false;
  }

  /**
   * Process a similar match found by regex
   */
  private static processSimilarMatch(
    searchMatch: RegExpExecArray,
    closingTag: string,
    element: string,
    originalContent: string
  ): { found: boolean; isCompact: boolean } {
    const startIndex = searchMatch.index;
    const openingTag = searchMatch[0];
    const endIndex = originalContent.indexOf(closingTag, startIndex + openingTag.length);

    if (endIndex === -1) {
      return { found: false, isCompact: false };
    }

    const originalElement = originalContent.substring(startIndex, endIndex + closingTag.length);

    if (this.areElementsSimilar(originalElement, element)) {
      const contentStart = originalElement.indexOf('>') + 1;
      const contentEnd = originalElement.lastIndexOf('<');

      if (contentStart < contentEnd) {
        const content = originalElement.substring(contentStart, contentEnd);
        return { found: true, isCompact: this.isContentCompact(content) };
      }
    }

    return { found: false, isCompact: false };
  }

  /**
   * Check if two elements are similar enough to compare
   */
  private static areElementsSimilar(originalElement: string, element: string): boolean {
    const originalNormalized = originalElement.replace(/\s+/g, ' ').trim();
    const elementNormalized = element.replace(/\s+/g, ' ').trim();

    return originalNormalized.includes(elementNormalized.substring(0, 30)) ||
      elementNormalized.includes(originalNormalized.substring(0, 30));
  }

  /**
   * Check if content is compact (no leading/trailing spaces and no line breaks)
   */
  private static isContentCompact(content: string): boolean {
    return !content.startsWith(' ') && !content.endsWith(' ') && !content.includes('\n');
  }

  /**
   * Analyze element characteristics
   */
  private static analyzeElement(element: string): ElementInfo {
    const trimmed = element.trim();
    const hasMultipleAttributes = (trimmed.match(/\s+\w+=/g) || []).length > 2;
    const hasLongAttributes = /\w+="[^"]{20,}"/.test(trimmed);

    return {
      content: trimmed,
      isMultilineInOriginal: false,
      totalLength: trimmed.length,
      hasComplexAttributes: hasMultipleAttributes || hasLongAttributes
    };
  }

  /**
   * Convert multiline element to single line with careful space handling
   */
  private static makeInline(element: string): string {
    // Preserve content inside interpolations and be careful with spaces
    const lines = element.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    let result = lines.join(' ');

    // Clean up excessive spaces but preserve interpolation formatting
    result = result.replace(/\s+/g, ' ');

    // Fix spacing around interpolations
    result = result.replace(/\s*\{\{\s*/g, '{{ ');
    result = result.replace(/\s*\}\}\s*/g, ' }}');

    // Remove unnecessary spaces between tags (like ><a and </a><)
    result = result.replace(/>\s+</g, '><');

    // Remove spaces immediately after opening tags and before closing tags for common inline elements
    result = result.replace(/(<(?:a|span|strong|em|b|i|small|label|button)[^>]*>)\s+/g, '$1');
    result = result.replace(/\s+(<\/(?:a|span|strong|em|b|i|small|label|button)>)/g, '$1');

    return result;
  }

  /**
   * Format tokens with proper indentation and smart inline handling
   */
  /**
   * Format tokens with proper indentation and smart inline handling
   */
  private static formatTokens(tokens: string[], options: FormattingOptions, originalContent: string): string {
    const context = this.createFormattingContext(options);
    return this.processAllTokens(tokens, context, originalContent, options);
  }

  /**
   * Create formatting context with indentation configuration
   */
  private static createFormattingContext(options: FormattingOptions) {
    const { indentSize, useSpaces } = options;
    const indentChar = useSpaces ? ' ' : '\t';
    const indentUnit = useSpaces ? indentChar.repeat(indentSize) : indentChar;

    return {
      indentUnit,
      indent: 0,
      output: [] as string[]
    };
  }

  /**
   * Process all tokens with the formatting context
   */
  private static processAllTokens(
    tokens: string[],
    context: { indentUnit: string; indent: number; output: string[] },
    originalContent: string,
    options: FormattingOptions
  ): string {
    let i = 0;
    while (i < tokens.length) {
      const result = this.processSingleToken(tokens, i, context, originalContent, options);

      if (result.output) {
        context.output.push(result.output);
      }

      context.indent = result.newIndent;
      i = result.nextIndex;
    }

    return context.output.join('\n');
  }

  /**
   * Process a single token and return the result
   */
  private static processSingleToken(
    tokens: string[],
    index: number,
    context: { indentUnit: string; indent: number },
    originalContent: string,
    options: FormattingOptions
  ): { output: string | null; newIndent: number; nextIndex: number } {
    const token = tokens[index];

    // Skip empty tokens
    if (token.trim().length === 0) {
      return { output: null, newIndent: context.indent, nextIndex: index + 1 };
    }

    // Handle different token types
    if (this.isAngularInterpolation(token)) {
      return this.processInterpolationToken(token, context, index);
    }

    if (this.isTextContent(token)) {
      return this.processTextToken(tokens, index, context, originalContent, options);
    }

    return this.processHtmlToken(tokens, index, context, originalContent, options);
  }

  /**
   * Process interpolation token
   */
  private static processInterpolationToken(
    token: string,
    context: { indentUnit: string; indent: number },
    index: number
  ): { output: string; newIndent: number; nextIndex: number } {
    const formattedInterpolation = this.formatAngularInterpolation(token);
    return {
      output: context.indentUnit.repeat(context.indent) + formattedInterpolation,
      newIndent: context.indent,
      nextIndex: index + 1
    };
  }

  /**
   * Process text content token
   */
  private static processTextToken(
    tokens: string[],
    index: number,
    context: { indentUnit: string; indent: number },
    originalContent: string,
    options: FormattingOptions
  ): { output: string | null; newIndent: number; nextIndex: number } {
    const token = tokens[index];
    const cleanedText = token.trim();

    if (cleanedText.length === 0) {
      return { output: null, newIndent: context.indent, nextIndex: index + 1 };
    }

    const isPartOfInlineElement = this.isTokenPartOfInlineElement(tokens, index, options, originalContent);
    const output = isPartOfInlineElement
      ? cleanedText
      : context.indentUnit.repeat(context.indent) + cleanedText;

    return { output, newIndent: context.indent, nextIndex: index + 1 };
  }

  /**
   * Process HTML token (elements, blocks)
   */
  private static processHtmlToken(
    tokens: string[],
    index: number,
    context: { indentUnit: string; indent: number },
    originalContent: string,
    options: FormattingOptions
  ): { output: string | null; newIndent: number; nextIndex: number } {
    const trimmedToken = tokens[index].trim();

    // Try inline element with content first
    if (trimmedToken.startsWith('<') && !trimmedToken.startsWith('</')) {
      const inlineResult = this.tryCreateInlineElementWithContent(tokens, index, options, originalContent);
      if (inlineResult.element) {
        return {
          output: context.indentUnit.repeat(context.indent) + inlineResult.element,
          newIndent: context.indent,
          nextIndex: inlineResult.nextIndex
        };
      }
    }

    // Try regular inline element
    const inlineResult = this.handleInlineElement(tokens, index, options, originalContent, context.indent, context.indentUnit);
    if (inlineResult.handled) {
      return {
        output: inlineResult.content,
        newIndent: context.indent,
        nextIndex: inlineResult.nextIndex
      };
    }

    // Handle as regular token
    const regularResult = this.handleRegularToken(trimmedToken, context.indent, context.indentUnit);
    return {
      output: regularResult.content,
      newIndent: regularResult.newIndent,
      nextIndex: index + 1
    };
  }

  /**
   * Handle inline element processing
   */
  private static handleInlineElement(
    tokens: string[],
    index: number,
    options: FormattingOptions,
    originalContent: string,
    currentIndent: number,
    indentUnit: string
  ): { handled: boolean, content: string, nextIndex: number } {
    const trimmedToken = tokens[index].trim();

    if (!this.isHtmlElement(trimmedToken) || !this.shouldKeepInline(trimmedToken, options, originalContent)) {
      return { handled: false, content: '', nextIndex: index };
    }

    const inlineElement = this.tryCreateInlineElement(tokens, index, options, originalContent);
    if (inlineElement.element) {
      return {
        handled: true,
        content: indentUnit.repeat(currentIndent) + inlineElement.element,
        nextIndex: inlineElement.nextIndex
      };
    }

    return { handled: false, content: '', nextIndex: index };
  }

  /**
   * Handle regular token processing
   */
  private static handleRegularToken(
    token: string,
    currentIndent: number,
    indentUnit: string
  ): { content: string, newIndent: number } {
    let indent = currentIndent;

    // Handle closing blocks first (reduce indentation before adding the line)
    if (BlockAnalyzer.isClosingBlock(token)) {
      indent = Math.max(indent - 1, 0);
    }

    const content = indentUnit.repeat(indent) + token;

    // Handle opening blocks (increase indentation after adding the line)
    if (BlockAnalyzer.isOpeningBlock(token) && !BlockAnalyzer.isSelfClosingTag(token)) {
      indent++;
    }

    return { content, newIndent: indent };
  }

  /**
   * Check if a token is an HTML element
   */
  private static isHtmlElement(token: string): boolean {
    return token.startsWith('<') && token.includes('>') && !token.startsWith('<!--');
  }

  /**
   * Check if a token is an Angular interpolation
   */
  private static isAngularInterpolation(token: string): boolean {
    return token.includes('{{') && token.includes('}}');
  }

  /**
   * Format Angular interpolation to ensure proper spacing
   */
  private static formatAngularInterpolation(token: string): string {
    // Extract the content between {{ and }}
    const regex = /\{\{(.+?)\}\}/;
    const match = regex.exec(token);
    if (!match) return token;

    const content = match[1];

    // Ensure there's exactly one space after {{ and before }}
    const trimmedContent = content.trim();

    // If the content is empty, keep it as is but add spaces
    if (trimmedContent === '') {
      return '{{  }}';
    }

    // For content with pipes or multiple parts, preserve internal spacing
    let formattedContent = trimmedContent;

    // Handle pipes - ensure spaces around pipe symbols
    if (formattedContent.includes('|')) {
      formattedContent = formattedContent
        .split('|')
        .map(part => part.trim())
        .join(' | ');
    }

    // Handle other operators that need spacing, but ignore content inside quotes
    formattedContent = this.formatOperatorsOutsideQuotes(formattedContent);

    // Return with proper spacing
    return `{{ ${formattedContent} }}`;
  }

  /**
   * Format operators outside of quoted strings
   */
  private static formatOperatorsOutsideQuotes(content: string): string {
    const { result } = this.processCharacters(content);
    return result;
  }

  /**
   * Process characters in content, handling quotes and operators
   */
  private static processCharacters(content: string): { result: string } {
    let result = '';
    let inSingleQuotes = false;
    let inDoubleQuotes = false;
    let i = 0;

    while (i < content.length) {
      const char = content[i];
      const context = {
        char,
        nextChar: content[i + 1] || '',
        prevChar: content[i - 1] || '',
        inSingleQuotes,
        inDoubleQuotes,
        position: i
      };

      const processed = this.processCharacter(content, context);
      result += processed.output;
      inSingleQuotes = processed.inSingleQuotes;
      inDoubleQuotes = processed.inDoubleQuotes;
      i += processed.skipNext;
    }

    return { result };
  }

  /**
   * Process a single character with its context
   */
  private static processCharacter(
    content: string,
    context: {
      char: string;
      nextChar: string;
      prevChar: string;
      inSingleQuotes: boolean;
      inDoubleQuotes: boolean;
      position: number;
    }
  ): { output: string; inSingleQuotes: boolean; inDoubleQuotes: boolean; skipNext: number } {
    const { char, nextChar, prevChar, inSingleQuotes, inDoubleQuotes } = context;

    // Handle quote toggling
    if (char === "'" && !inDoubleQuotes && prevChar !== '\\') {
      return { output: char, inSingleQuotes: !inSingleQuotes, inDoubleQuotes, skipNext: 1 };
    }

    if (char === '"' && !inSingleQuotes && prevChar !== '\\') {
      return { output: char, inSingleQuotes, inDoubleQuotes: !inDoubleQuotes, skipNext: 1 };
    }

    // If inside quotes, preserve everything as-is
    if (inSingleQuotes || inDoubleQuotes) {
      return { output: char, inSingleQuotes, inDoubleQuotes, skipNext: 1 };
    }

    // Format operators outside quotes
    const operatorResult = this.formatOperator(char, nextChar, prevChar, content, context.position);
    return {
      output: operatorResult.output,
      inSingleQuotes,
      inDoubleQuotes,
      skipNext: operatorResult.skipNext
    };
  }

  /**
   * Format operators when outside quotes
   */
  private static formatOperator(
    char: string,
    nextChar: string,
    prevChar: string,
    content: string,
    position: number
  ): { output: string; skipNext: number } {
    // Check for compound operators first
    const compoundResult = this.formatCompoundOperator(char, nextChar, content, position);
    if (compoundResult.skipNext > 1) {
      return compoundResult;
    }

    // Check for simple operators
    const simpleResult = this.formatSimpleOperator(char, nextChar, prevChar);
    if (simpleResult.output !== char) {
      return simpleResult;
    }

    // Default: return character as-is
    return { output: char, skipNext: 1 };
  }

  /**
   * Format compound operators (>=, <=, &&, ||, ===, etc.)
   */
  private static formatCompoundOperator(
    char: string,
    nextChar: string,
    content: string,
    position: number
  ): { output: string; skipNext: number } {
    // Check three-character operators first
    const threeCharResult = this.formatThreeCharOperator(char, nextChar, content, position);
    if (threeCharResult.skipNext === 3) {
      return threeCharResult;
    }

    // Check two-character operators
    return this.formatTwoCharOperator(char, nextChar);
  }

  /**
   * Format three-character operators (===, !==)
   */
  private static formatThreeCharOperator(
    char: string,
    nextChar: string,
    content: string,
    position: number
  ): { output: string; skipNext: number } {
    if (char === '=' && nextChar === '=' && content[position + 2] === '=') {
      return { output: ' === ', skipNext: 3 };
    }
    if (char === '!' && nextChar === '=' && content[position + 2] === '=') {
      return { output: ' !== ', skipNext: 3 };
    }
    return { output: char, skipNext: 1 };
  }

  /**
   * Format two-character operators (&&, ||, ==, !=, <=, >=)
   */
  private static formatTwoCharOperator(
    char: string,
    nextChar: string
  ): { output: string; skipNext: number } {
    const twoCharOperators: { [key: string]: string } = {
      '&&': ' && ',
      '||': ' || ',
      '==': ' == ',
      '!=': ' != ',
      '<=': ' <= ',
      '>=': ' >= '
    };

    const operatorKey = char + nextChar;
    if (twoCharOperators[operatorKey]) {
      return { output: twoCharOperators[operatorKey], skipNext: 2 };
    }

    return { output: char, skipNext: 1 };
  }

  /**
   * Format simple operators (+, -, *, /, <, >)
   */
  private static formatSimpleOperator(
    char: string,
    nextChar: string,
    prevChar: string
  ): { output: string; skipNext: number } {
    const needsSpacing = !/\s/.test(prevChar) && !/\s/.test(nextChar);

    if (!needsSpacing) {
      return { output: char, skipNext: 1 };
    }

    switch (char) {
      case '+': return { output: ' + ', skipNext: 1 };
      case '-': return { output: ' - ', skipNext: 1 };
      case '*': return { output: ' * ', skipNext: 1 };
      case '/': return { output: ' / ', skipNext: 1 };
      case '<': return { output: ' < ', skipNext: 1 };
      case '>': return { output: ' > ', skipNext: 1 };
      default: return { output: char, skipNext: 1 };
    }
  }

  /**
   * Check if a token is plain text content (not HTML tags or Angular blocks)
   */
  private static isTextContent(token: string): boolean {
    const trimmed = token.trim();
    // Text content is anything that's not a tag, not an Angular block, and not an interpolation
    return !trimmed.startsWith('<') &&
      !trimmed.startsWith('@') &&
      !trimmed.startsWith('}') &&
      trimmed !== '}' &&
      !this.isAngularInterpolation(trimmed) &&
      trimmed.length > 0;
  }

  /**
   * Try to combine an element with its text content into a single line if appropriate
   */
  private static tryCreateInlineElementWithContent(
    tokens: string[],
    startIndex: number,
    options: FormattingOptions,
    originalContent: string
  ): { element: string | null, nextIndex: number } {
    const openingTag = tokens[startIndex].trim();

    // Validate opening tag
    const validation = this.validateOpeningTag(openingTag);
    if (!validation.isValid || !validation.tagName) {
      return { element: null, nextIndex: startIndex };
    }

    // Find element content and closing tag
    const elementData = this.findElementContent(tokens, startIndex, validation.tagName);
    if (!elementData.found) {
      return { element: null, nextIndex: startIndex };
    }

    // Build complete element
    const completeElement = this.buildCompleteElement(
      openingTag,
      elementData.contentParts,
      elementData.closingTag,
      originalContent
    );

    // Check if it should be inline
    if (this.shouldKeepInline(completeElement, options, originalContent)) {
      return { element: completeElement, nextIndex: elementData.endIndex + 1 };
    }

    return { element: null, nextIndex: startIndex };
  }

  /**
   * Validate and extract tag name from opening tag
   */
  private static validateOpeningTag(openingTag: string): { isValid: boolean; tagName: string | null } {
    if (!openingTag.startsWith('<') || openingTag.startsWith('</')) {
      return { isValid: false, tagName: null };
    }

    const tagRegex = /<(\w+)/;
    const tagMatch = tagRegex.exec(openingTag);
    if (!tagMatch) {
      return { isValid: false, tagName: null };
    }

    return { isValid: true, tagName: tagMatch[1] };
  }

  /**
   * Find element content between opening and closing tags
   */
  private static findElementContent(
    tokens: string[],
    startIndex: number,
    tagName: string
  ): {
    found: boolean;
    contentParts: string[];
    closingTag: string;
    endIndex: number;
  } {
    const closingTag = `</${tagName}>`;
    const contentParts: string[] = [];
    let currentIndex = startIndex + 1;
    const maxSafetyCheck = startIndex + 20;

    while (currentIndex < tokens.length && currentIndex < maxSafetyCheck) {
      const currentToken = tokens[currentIndex];

      if (currentToken.trim() === closingTag) {
        return {
          found: true,
          contentParts,
          closingTag,
          endIndex: currentIndex
        };
      }

      // Process token based on type
      const processedContent = this.processTokenForInlineContent(currentToken);
      if (processedContent) {
        contentParts.push(processedContent);
      } else if (!this.isTextContent(currentToken)) {
        // If we encounter another HTML tag, this is not a simple element
        break;
      }

      currentIndex++;
    }

    return { found: false, contentParts: [], closingTag, endIndex: currentIndex };
  }

  /**
   * Process a token for inline content
   */
  private static processTokenForInlineContent(token: string): string | null {
    if (this.isAngularInterpolation(token)) {
      return this.formatAngularInterpolation(token);
    }

    if (this.isTextContent(token)) {
      const trimmedText = token.trim();
      return trimmedText.length > 0 ? trimmedText : null;
    }

    return null;
  }

  /**
   * Build the complete element string
   */
  private static buildCompleteElement(
    openingTag: string,
    contentParts: string[],
    closingTag: string,
    originalContent: string
  ): string {
    if (contentParts.length === 0) {
      return `${openingTag}${closingTag}`;
    }

    // Check if original was compact to preserve style
    const fullElementForCheck = `${openingTag}${contentParts.join('')}${closingTag}`;
    const wasCompact = this.wasElementOriginallyCompact(fullElementForCheck, originalContent);

    const allContent = wasCompact ? contentParts.join('') : contentParts.join(' ');
    return `${openingTag}${allContent.trim()}${closingTag}`;
  }

  /**
   * Try to create an inline element from current and next tokens
   */
  private static tryCreateInlineElement(tokens: string[], startIndex: number, options: FormattingOptions, originalContent: string): { element: string | null, nextIndex: number } {
    const openingTag = tokens[startIndex].trim();

    // Extract tag name
    const tagRegex = /<(\w+)/;
    const tagMatch = tagRegex.exec(openingTag);
    if (!tagMatch) {
      return { element: null, nextIndex: startIndex };
    }

    const tagName = tagMatch[1];
    const closingTag = `</${tagName}>`;

    // Look for the closing tag within a reasonable range
    let content = openingTag;
    let currentIndex = startIndex + 1;
    const maxLookAhead = Math.min(startIndex + 8, tokens.length);

    while (currentIndex < maxLookAhead) {
      const currentToken = tokens[currentIndex].trim();

      if (currentToken === closingTag) {
        // Found complete element, create inline version
        const completeElement = this.makeInline(content + ' ' + currentToken);
        if (this.shouldKeepInline(completeElement, options, originalContent)) {
          return { element: completeElement, nextIndex: currentIndex + 1 };
        }
        break;
      }

      content += ' ' + currentToken;
      currentIndex++;
    }

    return { element: null, nextIndex: startIndex };
  }

  /**
   * Check if a text token is part of an element that should be kept inline
   */
  private static isTokenPartOfInlineElement(
    tokens: string[],
    currentIndex: number,
    options: FormattingOptions,
    originalContent: string
  ): boolean {
    // Look backwards to find the opening tag
    for (let i = currentIndex - 1; i >= 0; i--) {
      const token = tokens[i].trim();
      if (token.startsWith('<') && !token.startsWith('</')) {
        // Found an opening tag, check if it should be inline
        const tagRegex = /<(\w+)/;
        const tagMatch = tagRegex.exec(token);
        if (tagMatch) {
          const tagName = tagMatch[1].toLowerCase();
          const inlineElements = ['p', 'span', 'a', 'strong', 'em', 'b', 'i', 'small', 'label', 'button', 'li'];
          return inlineElements.includes(tagName);
        }
      }
      // If we find a closing tag or another opening tag, stop looking
      if (token.startsWith('<')) {
        break;
      }
    }
    return false;
  }
}
