import React from 'react';
import { useNotes } from '../../context/NotesContext';
import { getPlainTextPreview } from '../../utils/markdownParser';
import ThemeToggle from '../UI/ThemeToggle';
import NoteCard from '../UI/NoteCard';
import BulkActions from '../UI/BulkActions';
import SimpleList from '../UI/SimpleList';

const Sidebar = ({
  onNoteSelect }) => {
  const {
    notes,
    currentNote,
    loading,
    searchResults,
    isSearching,
    selectedNotes,
    isBulkSelectionMode,
    createNote,
    fetchNote,
    searchNotes,
    clearSearch,
    fetchNotes,
    toggleBulkSelection,
    toggleNoteSelection,
    selectAllNotes,
    clearSelectedNotes,
    bulkDeleteNotes
  } = useNotes();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [touchStart, setTouchStart] = React.useState(null);
  const searchTimeoutRef = React.useRef(null);

  const displayedNotes = (searchResults && searchResults.length > 0) || isSearching ? (searchResults || []) : (notes || []);

  const handleNoteClick = async (note) => {
    await fetchNote(note.id);
    if (onNoteSelect) {
      onNoteSelect();
    }
  };

  // Mobile detection and cleanup
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Touch interactions for mobile
  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
      time: Date.now()
    };

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = Math.abs(touchEnd.y - touchStart.y);
    const deltaTime = touchEnd.time - touchStart.time;

    // Detect swipe (horizontal movement, quick, minimal vertical movement)
    if (Math.abs(deltaX) > 50 && deltaTime < 300 && deltaY < 30) {
      // Could add swipe navigation here if needed
    }

    setTouchStart(null);
  };

  const handleCreateNote = async () => {
    if (isCreating) return;

    try {
      setIsCreating(true);
      const newNote = await createNote({
        title: 'Untitled Note',
        content: ''
      });
      fetchNote(newNote.id);
    } catch (error) {
      console.error('Failed to create note:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    console.log('=== HANDLE SEARCH DEBUG ===');
    console.log('Search input term:', term);
    setSearchTerm(term);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search with 500ms delay
    searchTimeoutRef.current = setTimeout(() => {
      console.log('Executing search for term:', term);
      if (term.trim()) {
        console.log('Calling searchNotes with:', term);
        searchNotes(term);
      } else {
        console.log('Clearing search');
        clearSearch();
      }
    }, 500);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Clear any pending debounced search
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      const term = e.target.value;
      if (term.trim()) {
        searchNotes(term);
      } else {
        clearSearch();
      }
    }
  };

  const handlePageChange = (page) => {
    if (isSearching) {
      searchNotes(searchTerm);
    } else {
      fetchNotes();
    }
  };

  const handleBulkDelete = async () => {
    await bulkDeleteNotes(selectedNotes);
  };

  const handleDragStart = (note) => {
    console.log('Drag started for note:', note.title);
  };

  const handleDragEnd = (note) => {
    console.log('Drag ended for note:', note.title);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('sidebar--drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('sidebar--drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('sidebar--drag-over');

    const noteData = e.dataTransfer.getData('text/plain');
    if (noteData) {
      try {
        const note = JSON.parse(noteData);
        console.log('Note dropped in sidebar:', note.title);
        fetchNote(note.id);
      } catch (error) {
        console.error('Error parsing dropped note data:', error);
      }
    }
  };

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

  return (
    <div
      className={`${isMobile ? 'sidebar--mobile' : 'sidebar'}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="sidebar-header">
        <h1 className="sidebar-title">
          {isMobile ? 'Notes' : 'Markdown Notes'}
        </h1>
        <div className="sidebar-header__actions">
          {!isMobile && (
            <button
              className="bulk-toggle-btn"
              onClick={toggleBulkSelection}
              disabled={loading}
            >
              {isBulkSelectionMode ? 'Cancel Selection' : 'Select'}
            </button>
          )}
          <button
            className="create-note-btn"
            onClick={handleCreateNote}
            disabled={isCreating || isBulkSelectionMode}
          >
            {isCreating ? 'Creating...' : '+'}
          </button>
          <ThemeToggle />
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={handleSearch}
          onKeyPress={handleSearchKeyPress}
          disabled={isBulkSelectionMode}
        />
      </div>

      {isBulkSelectionMode && selectedNotes.length > 0 && (
        <BulkActions
          selectedCount={selectedNotes.length}
          totalCount={displayedNotes.length}
          onSelectAll={selectAllNotes}
          onClearSelection={clearSelectedNotes}
          onDeleteSelected={handleBulkDelete}
          onCancelBulkMode={toggleBulkSelection}
          loading={loading}
        />
      )}

      <div
        className="notes-list"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {loading && displayedNotes.length === 0 ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>Loading...</span>
          </div>
        ) : displayedNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <div className="empty-state-title">
              {isSearching ? 'No results found' : 'No notes yet'}
            </div>
            <div className="empty-state-text">
              {isSearching
                ? 'Try a different search term'
                : 'Create your first note to get started'
              }
            </div>
          </div>
        ) : (
          <SimpleList
            items={displayedNotes}
            renderItem={(note, index) => (
              <NoteCard
                key={note.id}
                note={note}
                isActive={currentNote && currentNote.id === note.id}
                onClick={() => handleNoteClick(note)}
                tags={note.tags || []}
                isBulkSelectionMode={isBulkSelectionMode}
                isSelected={selectedNotes.includes(note.id)}
                onToggleSelection={toggleNoteSelection}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            )}
            className="simple-notes-list"
          />
        )}
      </div>

    </div>
  );
};

export default Sidebar;
