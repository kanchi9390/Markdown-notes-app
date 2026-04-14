import React from 'react';
import MarkdownEditor from '../Editor/MarkdownEditor';
import MarkdownPreview from '../Editor/MarkdownPreview';
import { useNotes } from '../../context/NotesContext';
import { useScrollSync } from '../../hooks/useScrollSync';
import TopBar from '../UI/TopBar';

const SplitLayout = ({ onBack }) => {
  const { currentNote, loading, updateCurrentNoteLocally } = useNotes();
  const { editorRef, previewRef } = useScrollSync();

  const handleContentChange = (content) => {
    updateCurrentNoteLocally({ content });
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading">
          <div className="loading-spinner"></div>
          <span>Loading note...</span>
        </div>
      </div>
    );
  }

  if (!currentNote) {
    return (
      <div className="main-content">
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-title">Select a note</div>
          <div className="empty-state-text">
            Choose a note from the sidebar or create a new one
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <TopBar note={currentNote} onBack={onBack} />

      <div className="editor-layout">
        <div className="editor-panel">
          <MarkdownEditor
            ref={editorRef}
            value={currentNote.content || ''}
            onChange={handleContentChange}
            placeholder="Start writing in Markdown..."
          />
        </div>
        <div className="preview-panel">
          <MarkdownPreview ref={previewRef} content={currentNote.content} />
        </div>
      </div>
    </div>
  );
};

export default SplitLayout;
