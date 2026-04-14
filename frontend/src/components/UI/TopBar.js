import React, { useEffect } from 'react';
import { useNotes } from '../../context/NotesContext';
import ExportButton from './ExportButton';

const TopBar = ({ note, onBack }) => {
  const { updateCurrentNoteLocally, saveCurrentNote, deleteCurrentNote } = useNotes();

  const handleSave = async () => {
    if (note) {
      try {
        await saveCurrentNote();
      } catch (error) {
        console.error('Failed to save note:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (note && window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteCurrentNote(note.id);
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const handleTitleChange = (title) => {
    if (note) {
      updateCurrentNoteLocally({ title });
    }
  };

  // Add keyboard shortcut for Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [note, handleSave]);

  return (
    <div className="top-bar">
      <div className="top-bar__left">
        {onBack && (
          <button
            className="top-bar__btn top-bar__btn--back"
            onClick={onBack}
            title="Back to notes"
          >
            <span className="back-icon">{"<"}</span>
          </button>
        )}
        <input
          type="text"
          className="top-bar__title"
          value={note?.title || ''}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Note title..."
        />
      </div>

      <div className="top-bar__right">
        <button
          className="top-bar__btn top-bar__btn--delete"
          onClick={handleDelete}
          disabled={!note}
          title="Delete note"
        >
          🗑️
        </button>
        <button
          className="top-bar__btn top-bar__btn--save"
          onClick={handleSave}
          disabled={!note}
          title="Save note (Ctrl+S)"
        >
          Save
        </button>
        <ExportButton note={note} />
      </div>
    </div>
  );
};

export default TopBar;
