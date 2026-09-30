import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authApi } from '../api/auth.api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error: toastError } = useToast();

  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.data) {
        setUser(res.data);
      }
    } catch (_) {
      setUser(null);
      localStorage.removeItem('linkedin_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: any) => {
    try {
      const res = await authApi.login(credentials);
      if (res.success && res.data) {
        if (res.data.token) {
          localStorage.setItem('linkedin_token', res.data.token);
        }
        setUser(res.data.user);
        await refreshUser();
        success(`Welcome back, ${res.data.user.fullName}!`);
      }
    } catch (err: any) {
      toastError(err.message || 'Login failed. Please check your credentials.');
      throw err;
    }
  };

  const register = async (data: any) => {
    try {
      const res = await authApi.register(data);
      if (res.success && res.data) {
        if (res.data.token) {
          localStorage.setItem('linkedin_token', res.data.token);
        }
        setUser(res.data.user);
        await refreshUser();
        success('Account created successfully! Welcome to LinkedIn.');
      }
    } catch (err: any) {
      toastError(err.message || 'Registration failed. Please check the form.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (_) {
      // Continue client cleanup even if network fails
    } finally {
      setUser(null);
      localStorage.removeItem('linkedin_token');
      success('Logged out successfully.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
