import React from 'react';

const NoteCard = ({
  note,
  isActive,
  onClick,
  tags = [],
  isBulkSelectionMode,
  isSelected,
  onToggleSelection,
  onDragStart,
  onDragEnd
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleCardClick = () => {
    if (isBulkSelectionMode) {
      onToggleSelection(note.id);
    } else {
      onClick(note.id);
    }
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onToggleSelection(note.id);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(note));
    e.dataTransfer.setData('noteId', note.id);
    e.target.classList.add('note-card--dragging');
    if (onDragStart) {
      onDragStart(note);
    }
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('note-card--dragging');
    if (onDragEnd) {
      onDragEnd(note);
    }
  };

  return (
    <div
      className={`note-card ${isActive ? 'note-card--active' : ''} ${isSelected ? 'note-card--selected' : ''} ${isBulkSelectionMode ? 'note-card--bulk-mode' : ''}`}
      onClick={handleCardClick}
      draggable={!isBulkSelectionMode}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {isBulkSelectionMode && (
        <div className="note-card__checkbox">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxClick}
            onClick={handleCheckboxClick}
          />
        </div>
      )}
      <div className="note-card__header">
        <h3 className="note-card__title">{note.title}</h3>
      </div>
    </div>
  );
};

export default NoteCard;
