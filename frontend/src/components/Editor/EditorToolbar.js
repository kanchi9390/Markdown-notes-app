import React from 'react';

const EditorToolbar = ({ onFormat, onChange, value }) => {
  const insertText = (before, after, selection) => {
    const textarea = document.querySelector('.markdown-editor');
    if (!textarea) return;

    const start = selection ? selection.start : textarea.selectionStart;
    const end = selection ? selection.end : textarea.selectionEnd;
    console.log("hyma", start, end, before, after, selection);
    const text = value || '';
    const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);

    // Call onChange to update React state
    onChange(newText);
    console.log(newText)

    // Restore cursor position after React re-renders
    setTimeout(() => {
      const updatedTextarea = document.querySelector('.markdown-editor');
      if (updatedTextarea) {
        // For code formatting, place cursor after the closing backtick
        // For other formatting, place cursor after the closing tag
        const newCursorPos = start + before.length + (end - start) + after.length;
        updatedTextarea.focus();
        updatedTextarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const replaceText = (replacement, start, end) => {
    const textarea = document.querySelector('.markdown-editor');
    if (!textarea) return;

    const text = value || '';
    const newText = text.substring(0, start) + replacement + text.substring(end);

    // Call onChange to update React state
    onChange(newText);

    // Restore cursor position after React re-renders
    setTimeout(() => {
      const updatedTextarea = document.querySelector('.markdown-editor');
      if (updatedTextarea) {
        const newCursorPos = start + replacement.length;
        updatedTextarea.focus();
        updatedTextarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const wrapSelection = (before, after) => {
    const textarea = document.querySelector('.markdown-editor');
    if (!textarea) return;

    const selection = {
      start: textarea.selectionStart,
      end: textarea.selectionEnd
    };

    insertText(before, after, selection);
  };

  const handleBold = () => {
    const textarea = document.querySelector('.markdown-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const hasBoldBefore = value.substring(start, start + 2) === '**';
    const hasBoldAfter = value.substring(end - 2, end) === '**';
    const isAlreadyBold = hasBoldBefore && hasBoldAfter;

    const selectedText = value.substring(start, end);
    console.log('Bold before:', hasBoldBefore, 'Bold after:', hasBoldAfter, 'Is bold:', isAlreadyBold);

    if (isAlreadyBold) {
      // Remove bold formatting
      const unBoldText = selectedText.slice(2, -2);
      replaceText(unBoldText, start, end);
    } else {
      // Add bold formatting
      wrapSelection('**', '**');
    }
  };
  const handleItalic = () => {
    const textarea = document.querySelector('.markdown-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    // Check if already italic
    const hasItalicBefore = value.substring(start, start + 1) === '*';
    const hasItalicAfter = value.substring(end - 1, end) === '*';
    const isAlreadyItalic = hasItalicBefore && hasItalicAfter;

    if (isAlreadyItalic) {
      // Remove italic formatting
      const unItalicText = selectedText.slice(1, -1);
      replaceText(unItalicText, start, end);
    } else {
      // Add italic formatting
      wrapSelection('*', '*');
    }
  };

  const handleHeading = (level) => {
    const textarea = document.querySelector('.markdown-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const headingPrefix = '#'.repeat(level) + ' ';

    // Check if already heading
    const hasHeadingBefore = value.substring(start, start + level + 1) === headingPrefix;
    const isAlreadyHeading = hasHeadingBefore;

    if (isAlreadyHeading) {
      // Remove heading formatting
      const unHeadingText = selectedText.slice(level + 1);
      replaceText(unHeadingText, start, end);
    } else {
      // Add heading formatting
      wrapSelection(headingPrefix, '');
    }
  };

  const handleCode = () => {
    const textarea = document.querySelector('.markdown-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    // Check if already code block
    const hasCodeBefore = value.substring(start, start + 3) === '```';
    const hasCodeAfter = value.substring(end - 3, end) === '```';
    const isAlreadyCode = hasCodeBefore && hasCodeAfter;

    if (isAlreadyCode) {
      // Remove code formatting
      const unCodeText = selectedText.slice(3, -3);
      replaceText(unCodeText, start, end);
    } else {
      // Add code formatting
      wrapSelection('```', '```');
    }
  };
  const handleList = (ordered) => {
    const textarea = document.querySelector('.markdown-editor');
    if (!textarea) return;

    const text = value || '';
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selectedText = text.substring(start, end);

    // Check if entire selection is already list formatted
    const isAlreadyOrdered = ordered && /^\d+\.\s/m.test(selectedText);
    const isAlreadyUnordered = !ordered && selectedText.startsWith('- ');
    const isAlreadyList = isAlreadyOrdered || isAlreadyUnordered;

    if (isAlreadyList) {
      // Remove list formatting from entire selection
      const unformattedText = ordered
        ? selectedText.replace(/^\d+\.\s/, '')
        : selectedText.replace(/^-\s/, '');
      replaceText(unformattedText, start, end);
    } else {
      // Add list formatting to entire selection
      const lines = selectedText ? selectedText.split('\n') : [''];
      const formattedLines = lines.map((line, index) => {
        const trimmedLine = line.trim();
        return ordered
          ? `${index + 1}. ${trimmedLine}`
          : `- ${trimmedLine}`;
      });

      
      const formattedText = formattedLines.join('\n');
      console.log(formattedLines);
      replaceText(formattedText, start, end);
    }
  };

  return (
    <div className="editor-toolbar">
      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={handleBold}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          className="toolbar-btn"
          onClick={handleItalic}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
      </div>

      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={() => handleHeading(1)}
          title="Heading 1 (Ctrl+1)"
        >
          H1
        </button>
        <button
          className="toolbar-btn"
          onClick={() => handleHeading(2)}
          title="Heading 2 (Ctrl+2)"
        >
          H2
        </button>
        <button
          className="toolbar-btn"
          onClick={() => handleHeading(3)}
          title="Heading 3 (Ctrl+3)"
        >
          H3
        </button>
      </div>

      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={() => handleList(false)}
          title="Bullet List (Ctrl+L)"
        >
          • List
        </button>
        <button
          className="toolbar-btn"
          onClick={() => handleList(true)}
          title="Numbered List (Ctrl+Shift+L)"
        >
          1. List
        </button>
        <button
          className="toolbar-btn"
          onClick={handleCode}
          title="Code (Ctrl+K)"
        >
          {'</>'}
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
