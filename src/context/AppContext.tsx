import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our app state
interface AppState {
  isAuthenticated: boolean;
  userPreferences: {
    notifications: boolean;
    language: string;
  };
}

// Define the context type with state and state updaters
interface AppContextType {
  state: AppState;
  setAuthenticated: (isAuthenticated: boolean) => void;
  updateUserPreferences: (preferences: Partial<AppState['userPreferences']>) => void;
}

// Initial state
const initialState: AppState = {
  isAuthenticated: false,
  userPreferences: {
    notifications: true,
    language: 'en',
  },
};

// Create the context with a default value
const AppContext = createContext<AppContextType>({
  state: initialState,
  setAuthenticated: () => {},
  updateUserPreferences: () => {},
});

// Context provider component
export const AppProvider = ({ children }: { children: ReactNode }): React.ReactElement => {
  const [state, setState] = useState<AppState>(initialState);

  const setAuthenticated = (isAuthenticated: boolean) => {
    setState(prevState => ({
      ...prevState,
      isAuthenticated,
    }));
  };

  const updateUserPreferences = (preferences: Partial<AppState['userPreferences']>) => {
    setState(prevState => ({
      ...prevState,
      userPreferences: {
        ...prevState.userPreferences,
        ...preferences,
      },
    }));
  };

  // Create the context value
  const contextValue: AppContextType = {
    state,
    setAuthenticated,
    updateUserPreferences,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the app context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  return context;
};
