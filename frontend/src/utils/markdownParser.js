import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options for better markdown parsing
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert line breaks to <br>
  sanitize: false, // We'll use DOMPurify for sanitization
  smartLists: true, // Smarter list behavior
  smartypants: true // Smart punctuation
});

/**
 * Parse markdown content to safe HTML
 * @param {string} markdown - Raw markdown content
 * @returns {string} Sanitized HTML
 */
export const parseMarkdown = (markdown) => {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  try {
    const html = marked(markdown);
    return DOMPurify.sanitize(html);
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return DOMPurify.sanitize(markdown.replace(/\n/g, '<br>'));
  }
};

/**
 * Extract plain text from markdown (for search previews)
 * @param {string} markdown - Raw markdown content
 * @param {number} maxLength - Maximum length of preview
 * @returns {string} Plain text preview
 */
export const getPlainTextPreview = (markdown, maxLength = 100) => {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  // Remove markdown syntax
  const plainText = markdown
    .replace(/#{1,6}\s+/g, '') // Headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italic
    .replace(/`(.*?)`/g, '$1') // Inline code
    .replace(/```[\s\S]*?```/g, '[Code block]') // Code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/\n+/g, ' ') // Newlines to spaces
    .trim();

  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + '...'
    : plainText;
};
