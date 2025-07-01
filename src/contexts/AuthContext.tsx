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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchProfile();
    }
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
      
      setAuthToken(data.token);
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
      
      setAuthToken(data.token);
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
      setIsLoading(true);
      setError(null);
      
      const { data } = await api.get('/profile');
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      handleError(error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setAuthToken(null);
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