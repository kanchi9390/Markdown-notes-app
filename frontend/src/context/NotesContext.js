import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/api';

// Initial state
const initialState = {
  notes: [],
  currentNote: null,
  loading: false,
  error: null,
  searchResults: [],
  isSearching: false,
  selectedNotes: [],
  isBulkSelectionMode: false
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_NOTES: 'SET_NOTES',
  SET_CURRENT_NOTE: 'SET_CURRENT_NOTE',
  UPDATE_CURRENT_NOTE: 'UPDATE_CURRENT_NOTE',
  ADD_NOTE: 'ADD_NOTE',
  UPDATE_NOTE: 'UPDATE_NOTE',
  DELETE_NOTE: 'DELETE_NOTE',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_SEARCHING: 'SET_SEARCHING',
  CLEAR_SEARCH: 'CLEAR_SEARCH',
  TOGGLE_BULK_SELECTION: 'TOGGLE_BULK_SELECTION',
  SET_SELECTED_NOTES: 'SET_SELECTED_NOTES',
  TOGGLE_NOTE_SELECTION: 'TOGGLE_NOTE_SELECTION',
  CLEAR_SELECTED_NOTES: 'CLEAR_SELECTED_NOTES'
};

// Reducer function
const notesReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case ACTIONS.SET_NOTES:
      return {
        ...state,
        notes: action.payload.notes,
        loading: false
      };

    case ACTIONS.SET_CURRENT_NOTE:
      return { ...state, currentNote: action.payload, loading: false };

    case ACTIONS.UPDATE_CURRENT_NOTE:
      return {
        ...state,
        currentNote: state.currentNote
          ? { ...state.currentNote, ...action.payload }
          : null
      };

    case ACTIONS.ADD_NOTE:
      return {
        ...state,
        notes: [action.payload, ...(state.notes || [])],
        currentNote: action.payload,
        loading: false
      };

    case ACTIONS.UPDATE_NOTE:
      return {
        ...state,
        notes: (state.notes || []).map(note =>
          note.id === action.payload.id ? action.payload : note
        ),
        currentNote: state.currentNote?.id === action.payload.id
          ? action.payload
          : state.currentNote,
        loading: false
      };

    case ACTIONS.DELETE_NOTE:
      return {
        ...state,
        notes: (state.notes || []).filter(note => note.id !== action.payload),
        currentNote: state.currentNote?.id === action.payload ? null : state.currentNote,
        loading: false
      };

    case ACTIONS.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload.notes,
        isSearching: false,
        loading: false
      };

    case ACTIONS.SET_SEARCHING:
      return { ...state, isSearching: action.payload };

    case ACTIONS.CLEAR_SEARCH:
      return {
        ...state,
        searchResults: [],
        isSearching: false,
        loading: false
      };


    case ACTIONS.TOGGLE_BULK_SELECTION:
      return {
        ...state,
        isBulkSelectionMode: !state.isBulkSelectionMode,
        selectedNotes: state.isBulkSelectionMode ? [] : state.selectedNotes
      };

    case ACTIONS.SET_SELECTED_NOTES:
      return { ...state, selectedNotes: action.payload };

    case ACTIONS.TOGGLE_NOTE_SELECTION:
      const noteId = action.payload;
      const isSelected = state.selectedNotes.includes(noteId);
      return {
        ...state,
        selectedNotes: isSelected
          ? state.selectedNotes.filter(id => id !== noteId)
          : [...state.selectedNotes, noteId]
      };

    case ACTIONS.CLEAR_SELECTED_NOTES:
      return { ...state, selectedNotes: [] };

    default:
      return state;
  }
};

// Context creation
const NotesContext = createContext();

// Provider component
export const NotesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  // Actions
  const actions = {
    setLoading: (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ACTIONS.CLEAR_ERROR }),

    // Fetch notes
    fetchNotes: async () => {
      try {
        actions.setLoading(true);
        actions.clearError();
        const response = await apiService.getNotes();
        dispatch({
          type: ACTIONS.SET_NOTES,
          payload: {
            notes: response.data || []
          }
        });
      } catch (error) {
        console.error('Fetch notes error:', error);
        actions.setError(error.message);
        // Don't clear notes on error, keep existing ones
        dispatch({
          type: ACTIONS.SET_LOADING,
          payload: false
        });
      }
    },

    // Fetch single note
    fetchNote: async (id) => {
      try {
        actions.setLoading(true);
        actions.clearError();
        const response = await apiService.getNote(id);
        dispatch({ type: ACTIONS.SET_CURRENT_NOTE, payload: response.data });
      } catch (error) {
        actions.setError(error.message);
      }
    },

    // Create note
    createNote: async (noteData) => {
      try {
        actions.setLoading(true);
        actions.clearError();
        const response = await apiService.createNote(noteData);
        dispatch({ type: ACTIONS.ADD_NOTE, payload: response.data });
        return response.data;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      }
    },

    // Update note
    updateNote: async (id, noteData) => {
      try {
        actions.setLoading(true);
        actions.clearError();
        const response = await apiService.updateNote(id, noteData);
        dispatch({ type: ACTIONS.UPDATE_NOTE, payload: response.data });
        return response.data;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      }
    },

    // Delete note
    deleteNote: async (id) => {
      try {
        actions.setLoading(true);
        actions.clearError();
        await apiService.deleteNote(id);
        dispatch({ type: ACTIONS.DELETE_NOTE, payload: id });
      } catch (error) {
        actions.setError(error.message);
        throw error;
      }
    },

    // Search notes
    searchNotes: async (searchTerm) => {
      try {
        console.log('=== CONTEXT SEARCH DEBUG ===');
        console.log('Searching for:', searchTerm);
        dispatch({ type: ACTIONS.SET_SEARCHING, payload: true });
        actions.clearError();
        const response = await apiService.searchNotes(searchTerm);
        console.log('API response:', response);
        dispatch({
          type: ACTIONS.SET_SEARCH_RESULTS,
          payload: {
            notes: response.data
          }
        });
        console.log('Dispatched SET_SEARCH_RESULTS with:', response.data);
      } catch (error) {
        console.error('Search error:', error);
        actions.setError(error.message);
      } finally {
        dispatch({ type: ACTIONS.SET_SEARCHING, payload: false });
      }
    },

    // Clear search
    clearSearch: () => {
      dispatch({ type: ACTIONS.CLEAR_SEARCH });
    },

    // Bulk selection actions
    toggleBulkSelection: () => {
      dispatch({ type: ACTIONS.TOGGLE_BULK_SELECTION });
    },

    toggleNoteSelection: (noteId) => {
      dispatch({ type: ACTIONS.TOGGLE_NOTE_SELECTION, payload: noteId });
    },

    selectAllNotes: () => {
      const allNoteIds = state.isSearching
        ? (state.searchResults || []).map(note => note.id)
        : (state.notes || []).map(note => note.id);
      dispatch({ type: ACTIONS.SET_SELECTED_NOTES, payload: allNoteIds });
    },

    clearSelectedNotes: () => {
      dispatch({ type: ACTIONS.CLEAR_SELECTED_NOTES });
    },

    // Bulk delete
    bulkDeleteNotes: async (noteIds) => {
      try {
        actions.setLoading(true);
        actions.clearError();

        // Use bulk delete API
        await apiService.bulkDeleteNotes(noteIds);

        // Clear selection and refresh notes
        actions.clearSelectedNotes();
        await actions.fetchNotes();
      } catch (error) {
        actions.setError(error.message);
      }
    },

    // Update current note locally
    updateCurrentNoteLocally: (updates) => {
      dispatch({ type: ACTIONS.UPDATE_CURRENT_NOTE, payload: updates });
    },

    // Save current note manually
    saveCurrentNote: async () => {
      if (!state.currentNote || !state.currentNote.id) {
        throw new Error('No note to save');
      }

      try {
        actions.setLoading(true);
        actions.clearError();

        const updatedNote = await actions.updateNote(state.currentNote.id, {
          title: state.currentNote.title,
          content: state.currentNote.content
        });

        return updatedNote;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      }
    },

    // Delete current note
    deleteCurrentNote: async (noteId) => {
      try {
        await actions.deleteNote(noteId);
      } catch (error) {
        actions.setError(error.message);
        throw error;
      }
    }
  };


  // Load initial notes
  useEffect(() => {
    actions.fetchNotes();
  }, []);

  const value = {
    ...state,
    ...actions
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};

// Custom hook to use the context
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export { ACTIONS };
