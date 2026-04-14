import { parseMarkdown } from './markdownParser';

/**
 * Export note as Markdown file
 * @param {Object} note - Note object with title and content
 */
export const exportAsMarkdown = (note) => {
  if (!note) return '';
  
  const markdown = `# ${note.title || 'Untitled'}\n\n${note.content || ''}`;
  return markdown;
};

/**
 * Export note as HTML file
 * @param {Object} note - Note object with title and content
 */
export const exportAsHTML = (note) => {
  if (!note) return '';
  
  const htmlContent = parseMarkdown(note.content || '');
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${note.title || 'Untitled'}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
        }
        h1 {
            font-size: 2em;
            border-bottom: 1px solid #e1e5e9;
            padding-bottom: 10px;
        }
        h2 {
            font-size: 1.5em;
            border-bottom: 1px solid #e1e5e9;
            padding-bottom: 8px;
        }
        p {
            margin-bottom: 16px;
        }
        ul, ol {
            margin-bottom: 16px;
            padding-left: 2em;
        }
        li {
            margin-bottom: 4px;
        }
        code {
            background: #f1f3f4;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 85%;
        }
        pre {
            background: #f6f8fa;
            border: 1px solid #e1e5e9;
            border-radius: 6px;
            padding: 16px;
            overflow-x: auto;
        }
        pre code {
            background: none;
            padding: 0;
        }
        blockquote {
            border-left: 4px solid #dfe2e5;
            padding-left: 16px;
            margin: 16px 0;
            color: #6c757d;
            font-style: italic;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        strong {
            font-weight: 600;
        }
        em {
            font-style: italic;
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;
  
  return html;
};

/**
 * Download file with given content and filename
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} mimeType - MIME type
 */
export const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the object URL
  URL.revokeObjectURL(url);
};

/**
 * Export and download note as Markdown file
 * @param {Object} note - Note object
 */
export const downloadMarkdown = (note) => {
  const markdown = exportAsMarkdown(note);
  const filename = `${(note.title || 'Untitled').replace(/[^a-z0-9]/gi, '_')}.md`;
  downloadFile(markdown, filename, 'text/markdown');
};

/**
 * Export and download note as HTML file
 * @param {Object} note - Note object
 */
export const downloadHTML = (note) => {
  const html = exportAsHTML(note);
  const filename = `${(note.title || 'Untitled').replace(/[^a-z0-9]/gi, '_')}.html`;
  downloadFile(html, filename, 'text/html');
};
