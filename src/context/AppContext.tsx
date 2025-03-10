import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  isAdmin: boolean;
  id: string;
  email: string;
}

// Define the shape of our app state
interface AppState {
  isAuthenticated: boolean;
  userPreferences: {
    notifications: boolean;
    language: string;
  };
  user: User | null;
}

// Define the context type with state and state updaters
interface AppContextType {
  state: AppState;
  user: User | null;
  setAuthenticated: (isAuthenticated: boolean) => void;
  updateUserPreferences: (preferences: Partial<AppState['userPreferences']>) => void;
  setUser: (user: User | null) => void;
}

// Initial state
const initialState: AppState = {
  isAuthenticated: false,
  userPreferences: {
    notifications: true,
    language: 'en',
  },
  user: null,
};

// Create the context with a default value
const AppContext = createContext<AppContextType>({
  state: initialState,
  user: null,
  setAuthenticated: () => {},
  updateUserPreferences: () => {},
  setUser: () => {},
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

  const setUser = (user: User | null) => {
    setState(prevState => ({
      ...prevState,
      user,
    }));
  };

  // Create the context value
  const contextValue: AppContextType = {
    state,
    user: state.user,
    setAuthenticated,
    updateUserPreferences,
    setUser,
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
