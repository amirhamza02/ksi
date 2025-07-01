import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../lib/api';
import {
  User,
  RegisterData,
  ChangePasswordData,
  AuthContextType
} from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with true to check for existing token
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('authUser');
      
      if (token && savedUser) {
        try {
          setAuthToken(token);
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
          
          // Optionally try to refresh user data from server
          // but don't logout if it fails
          try {
            await fetchProfile();
          } catch (error) {
            // If profile fetch fails, keep using cached user data
            console.warn('Failed to refresh profile, using cached data');
          }
        } catch (error) {
          // If there's an error with cached data, clear it
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const handleError = (error: unknown) => {
    let errorMessage = 'An unexpected error occurred';
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    setError(errorMessage);
    throw new Error(errorMessage);
  };

  const login = async (userName: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await api.post('/Auth/authentication', { userName, password });
      console.log(" response data ", data);
      
      // Save both token and user data
      setAuthToken(data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data } = await api.post('/registration', userData);
      
      // Save both token and user data
      setAuthToken(data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (data: ChangePasswordData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      await api.post('/change-password', data);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async (): Promise<void> => {
    try {
      setError(null);
      
      const { data } = await api.get('/profile');
      setUser(data);
      setIsAuthenticated(true);
      
      // Update cached user data
      localStorage.setItem('authUser', JSON.stringify(data));
    } catch (error) {
      // Don't logout on profile fetch failure during initialization
      // Only throw error if this is called explicitly
      throw error;
    }
  };

  const logout = (): void => {
    setAuthToken(null);
    localStorage.removeItem('authUser');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    changePassword,
    fetchProfile,
    isAuthenticated,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};