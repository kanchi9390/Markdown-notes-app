import React from 'react';
import { parseMarkdown } from '../../utils/markdownParser';

const MarkdownPreview = ({ content }) => {
  const html = parseMarkdown(content || '');

  return (
    <div
      className="markdown-preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownPreview;
