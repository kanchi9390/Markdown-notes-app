import React, { useRef, useEffect } from 'react';
import EditorToolbar from './EditorToolbar';

const MarkdownEditor = ({ value, onChange, placeholder = 'Start writing in Markdown...' }) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);


  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
        break;

      case 'b':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const newValue = value.substring(0, start) + '**' + selectedText + '**' + value.substring(end);
          onChange(newValue);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + 4;
          }, 0);
        }
        break;

      case 'i':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const newValue = value.substring(0, start) + '*' + selectedText + '*' + value.substring(end);
          onChange(newValue);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + 2;
          }, 0);
        }
        break;

      case 'k':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const newValue = value.substring(0, start) + '`' + selectedText + '`' + value.substring(end);
          onChange(newValue);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + 1;
          }, 0);
        }
        break;
    }
  };

  const handleFormat = (before, after) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newValue);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + before.length + selectedText.length + after.length;
    }, 0);
  };


  return (
    <div className="editor-container">
      <EditorToolbar onFormat={handleFormat} onChange={onChange} value={value} />
      <textarea
        ref={textareaRef}
        className="markdown-editor"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        spellCheck={false}
        style={{
          minHeight: '100%',
          height: '100%',
          resize: 'none',
          overflow: 'auto'
        }}
      />
    </div>
  );
};

export default MarkdownEditor;
