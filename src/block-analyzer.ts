/**
 * Block Analysis Module - Handles Angular and HTML block detection
 */

export class BlockAnalyzer {
  private static readonly VOID_ELEMENTS = [
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img',
    'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
  ];

  /**
   * Check if a line represents an opening block
   */
  static isOpeningBlock(line: string): boolean {
    // Don't treat {{ as opening block if it's part of interpolation
    if (this.isAngularInterpolation(line)) {
      return false;
    }

    // Angular control flow blocks that open a new scope
    const angularControlPattern = /@(?:if|else|for|switch|case|default|defer|loading|error|placeholder)\s*(\([^)]*\))?\s*\{/;
    if (angularControlPattern.test(line)) {
      return true;
    }

    // Simple check for lines ending with {
    if (line.trim().endsWith('{') && !line.includes('@}')) {
      return true;
    }

    // HTML opening tags (not self-closing)
    if (line.startsWith('<') && !line.startsWith('</') && !this.isSelfClosingTag(line)) {
      return true;
    }

    return false;
  }

  /**
   * Check if a line represents a closing block
   */
  static isClosingBlock(line: string): boolean {
    const trimmed = line.trim();

    // Don't treat }} as closing block if it's part of interpolation
    if (this.isAngularInterpolation(trimmed)) {
      return false;
    }

    // Angular control flow closing
    if (trimmed === '@}' || trimmed === '}') {
      return true;
    }

    // HTML closing tags
    if (trimmed.startsWith('</') && trimmed.endsWith('>')) {
      return true;
    }

    return false;
  }

  /**
   * Check if an HTML tag is self-closing
   */
  static isSelfClosingTag(line: string): boolean {
    // HTML self-closing tags
    if (line.endsWith('/>')) {
      return true;
    }

    // Common HTML void elements
    const tagPattern = /<(\w+)/;
    const tagMatch = tagPattern.exec(line);
    if (tagMatch) {
      const tagName = tagMatch[1].toLowerCase();
      return this.VOID_ELEMENTS.includes(tagName);
    }

    return false;
  }

  /**
   * Check if a line contains Angular interpolation {{ }}
   */
  static isAngularInterpolation(line: string): boolean {
    return line.includes('{{') && line.includes('}}');
  }
}
