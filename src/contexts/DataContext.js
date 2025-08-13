import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { dataService } from '../services/dataService';

// Data context for managing global data state
const DataContext = createContext();

// Action types
const DATA_ACTIONS = {
  LOADING_START: 'LOADING_START',
  LOADING_SUCCESS: 'LOADING_SUCCESS',
  LOADING_ERROR: 'LOADING_ERROR',
  REFRESH_DATA: 'REFRESH_DATA',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Initial state
const initialState = {
  loading: true,
  error: null,
  userProfile: null,
  gamingData: null,
  skillsData: null,
  projectsData: null,
  loaded: false,
  lastUpdated: null,
};

// Reducer
const dataReducer = (state, action) => {
  switch (action.type) {
    case DATA_ACTIONS.LOADING_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case DATA_ACTIONS.LOADING_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        ...action.payload,
        loaded: true,
        lastUpdated: Date.now(),
      };

    case DATA_ACTIONS.LOADING_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        loaded: false,
      };

    case DATA_ACTIONS.REFRESH_DATA:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case DATA_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Data Provider Component
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      dispatch({ type: DATA_ACTIONS.LOADING_START });

      const data = await dataService.loadAllData();

      dispatch({
        type: DATA_ACTIONS.LOADING_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      dispatch({
        type: DATA_ACTIONS.LOADING_ERROR,
        payload: error,
      });
    }
  };

  const refreshData = async () => {
    try {
      dispatch({ type: DATA_ACTIONS.REFRESH_DATA });

      // Clear cache to force fresh data
      dataService.clearCache();

      const data = await dataService.loadAllData();

      dispatch({
        type: DATA_ACTIONS.LOADING_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.error('Failed to refresh data:', error);
      dispatch({
        type: DATA_ACTIONS.LOADING_ERROR,
        payload: error,
      });
    }
  };

  const clearError = () => {
    dispatch({ type: DATA_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    refreshData,
    clearError,
    loadData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook to use data context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Specific hooks for different data types
export const useUserProfile = () => {
  const { userProfile, loading, error } = useData();
  return { userProfile, loading, error };
};

export const useGamingData = () => {
  const { gamingData, loading, error } = useData();
  return { gamingData, loading, error };
};

export const useSkillsData = () => {
  const { skillsData, loading, error } = useData();
  return { skillsData, loading, error };
};

export const useProjectsData = () => {
  const { projectsData, loading, error } = useData();
  return { projectsData, loading, error };
};
