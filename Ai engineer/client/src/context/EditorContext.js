import React, { createContext, useContext, useReducer, useEffect } from 'react';

const EditorContext = createContext();

const initialState = {
  floorplan: null,
  currentView: '2d',
  selectedTool: 'select',
  selectedObject: null,
  history: [],
  historyIndex: -1,
  isDirty: false,
  isSaving: false,
  collaborators: [],
  realTimeUpdates: true,
  gridSettings: {
    enabled: true,
    size: 20,
    snapToGrid: true
  },
  viewSettings: {
    zoom: 1,
    pan: { x: 0, y: 0 }
  },
  aiSuggestions: [],
  costEstimate: null,
  isLoading: false,
  error: null
};

const editorReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FLOORPLAN':
      return {
        ...state,
        floorplan: action.payload,
        isDirty: false,
        history: [action.payload],
        historyIndex: 0
      };

    case 'UPDATE_FLOORPLAN':
      const newFloorplan = { ...state.floorplan, ...action.payload };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newFloorplan);
      
      return {
        ...state,
        floorplan: newFloorplan,
        isDirty: true,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };

    case 'SET_CURRENT_VIEW':
      return {
        ...state,
        currentView: action.payload
      };

    case 'SET_SELECTED_TOOL':
      return {
        ...state,
        selectedTool: action.payload
      };

    case 'SET_SELECTED_OBJECT':
      return {
        ...state,
        selectedObject: action.payload
      };

    case 'ADD_TO_HISTORY':
      const updatedHistory = state.history.slice(0, state.historyIndex + 1);
      updatedHistory.push(action.payload);
      
      return {
        ...state,
        floorplan: action.payload,
        isDirty: true,
        history: updatedHistory,
        historyIndex: updatedHistory.length - 1
      };

    case 'UNDO':
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          ...state,
          floorplan: state.history[newIndex],
          historyIndex: newIndex,
          isDirty: true
        };
      }
      return state;

    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          ...state,
          floorplan: state.history[newIndex],
          historyIndex: newIndex,
          isDirty: true
        };
      }
      return state;

    case 'SET_SAVING':
      return {
        ...state,
        isSaving: action.payload
      };

    case 'SET_DIRTY':
      return {
        ...state,
        isDirty: action.payload
      };

    case 'SET_COLLABORATORS':
      return {
        ...state,
        collaborators: action.payload
      };

    case 'ADD_COLLABORATOR':
      return {
        ...state,
        collaborators: [...state.collaborators, action.payload]
      };

    case 'REMOVE_COLLABORATOR':
      return {
        ...state,
        collaborators: state.collaborators.filter(c => c.id !== action.payload)
      };

    case 'UPDATE_GRID_SETTINGS':
      return {
        ...state,
        gridSettings: { ...state.gridSettings, ...action.payload }
      };

    case 'UPDATE_VIEW_SETTINGS':
      return {
        ...state,
        viewSettings: { ...state.viewSettings, ...action.payload }
      };

    case 'SET_AI_SUGGESTIONS':
      return {
        ...state,
        aiSuggestions: action.payload
      };

    case 'ADD_AI_SUGGESTION':
      return {
        ...state,
        aiSuggestions: [...state.aiSuggestions, action.payload]
      };

    case 'APPLY_AI_SUGGESTION':
      return {
        ...state,
        aiSuggestions: state.aiSuggestions.map(suggestion =>
          suggestion.id === action.payload
            ? { ...suggestion, applied: true }
            : suggestion
        )
      };

    case 'SET_COST_ESTIMATE':
      return {
        ...state,
        costEstimate: action.payload
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    case 'RESET_EDITOR':
      return {
        ...initialState,
        gridSettings: state.gridSettings,
        viewSettings: state.viewSettings
      };

    default:
      return state;
  }
};

export const EditorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  // Auto-save functionality
  useEffect(() => {
    if (state.isDirty && !state.isSaving) {
      const timeoutId = setTimeout(() => {
        handleAutoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [state.isDirty, state.isSaving]);

  const handleAutoSave = async () => {
    if (!state.floorplan || state.isSaving) return;

    dispatch({ type: 'SET_SAVING', payload: true });
    
    try {
      // Simulate auto-save API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ type: 'SET_DIRTY', payload: false });
      console.log('Auto-saved floorplan');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Auto-save failed' });
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  const setFloorplan = (floorplan) => {
    dispatch({ type: 'SET_FLOORPLAN', payload: floorplan });
  };

  const updateFloorplan = (updates) => {
    dispatch({ type: 'UPDATE_FLOORPLAN', payload: updates });
  };

  const setCurrentView = (view) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
  };

  const setSelectedTool = (tool) => {
    dispatch({ type: 'SET_SELECTED_TOOL', payload: tool });
  };

  const setSelectedObject = (object) => {
    dispatch({ type: 'SET_SELECTED_OBJECT', payload: object });
  };

  const addToHistory = (floorplan) => {
    dispatch({ type: 'ADD_TO_HISTORY', payload: floorplan });
  };

  const undo = () => {
    dispatch({ type: 'UNDO' });
  };

  const redo = () => {
    dispatch({ type: 'REDO' });
  };

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const saveFloorplan = async () => {
    if (!state.floorplan || state.isSaving) return;

    dispatch({ type: 'SET_SAVING', payload: true });
    
    try {
      // Simulate save API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ type: 'SET_DIRTY', payload: false });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Save failed' });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  const setCollaborators = (collaborators) => {
    dispatch({ type: 'SET_COLLABORATORS', payload: collaborators });
  };

  const addCollaborator = (collaborator) => {
    dispatch({ type: 'ADD_COLLABORATOR', payload: collaborator });
  };

  const removeCollaborator = (collaboratorId) => {
    dispatch({ type: 'REMOVE_COLLABORATOR', payload: collaboratorId });
  };

  const updateGridSettings = (settings) => {
    dispatch({ type: 'UPDATE_GRID_SETTINGS', payload: settings });
  };

  const updateViewSettings = (settings) => {
    dispatch({ type: 'UPDATE_VIEW_SETTINGS', payload: settings });
  };

  const setAISuggestions = (suggestions) => {
    dispatch({ type: 'SET_AI_SUGGESTIONS', payload: suggestions });
  };

  const addAISuggestion = (suggestion) => {
    dispatch({ type: 'ADD_AI_SUGGESTION', payload: suggestion });
  };

  const applyAISuggestion = (suggestionId) => {
    dispatch({ type: 'APPLY_AI_SUGGESTION', payload: suggestionId });
  };

  const setCostEstimate = (estimate) => {
    dispatch({ type: 'SET_COST_ESTIMATE', payload: estimate });
  };

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const resetEditor = () => {
    dispatch({ type: 'RESET_EDITOR' });
  };

  const value = {
    ...state,
    // Actions
    setFloorplan,
    updateFloorplan,
    setCurrentView,
    setSelectedTool,
    setSelectedObject,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    saveFloorplan,
    setCollaborators,
    addCollaborator,
    removeCollaborator,
    updateGridSettings,
    updateViewSettings,
    setAISuggestions,
    addAISuggestion,
    applyAISuggestion,
    setCostEstimate,
    setLoading,
    setError,
    clearError,
    resetEditor
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
