import React, { useState } from 'react';
import { NotesProvider } from './context/NotesContext';
import Sidebar from './components/Layout/Sidebar';
import SplitLayout from './components/Layout/SplitLayout';
import TopBar from './components/UI/TopBar';
import ErrorBoundary from './components/ErrorBoundary';
import { useNotes } from './context/NotesContext';
import './styles/main.css';

function AppContent() {
  const { currentNote } = useNotes();
  const [showEditor, setShowEditor] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNoteSelect = () => {
    setShowEditor(true);
  };

  const handleBack = () => {
    setShowEditor(false);
  };

  return (
    <div className="app-container">
      {/* Mobile: Show either sidebar or editor, Desktop: Show both */}
      {isMobile ? (
        <div className="mobile-layout">
          {!showEditor ? (
            <div className="mobile-view">
              <Sidebar onNoteSelect={handleNoteSelect} />
            </div>
          ) : currentNote ? (
            <div className="mobile-view">
              <SplitLayout onBack={handleBack} />
            </div>
          ) : (
            <div className="mobile-view mobile-empty-state">
              <div className="empty-state-icon">Select a note</div>
            </div>
          )}
        </div>
      ) : (
        <div className="desktop-layout">
          <Sidebar />
          {currentNote && <SplitLayout />}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <NotesProvider>
        <AppContent />
      </NotesProvider>
    </ErrorBoundary>
  );
}

export default App;
