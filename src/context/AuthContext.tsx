import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, auth, API_ENDPOINTS, ApiError } from '../lib/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'PET_PARENT' | 'PET_SITTER' | 'BOTH' | 'ADMIN';
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  verifiedId: boolean;
  avatar?: string;
  profile?: any;
  subscription?: any;
  hasCompletedProfile?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (data: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
  verifyPhone: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    const token = auth.getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get(API_ENDPOINTS.AUTH.ME);
      if (response.success && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      auth.removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const signup = async (data: any) => {
    const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, data, false);
    if (response.success && response.data) {
      const { token, user } = response.data;
      auth.setToken(token);
      setUser(user);
    } else {
      throw new Error(response.data?.error || 'Signup failed');
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password }, false);
    if (response.success && response.data) {
      const { token, user } = response.data;
      auth.setToken(token);
      setUser(user);
    } else {
      throw new Error(response.data?.error || 'Login failed');
    }
  };

  const logout = () => {
    auth.removeToken();
    setUser(null);
  };

  const verifyEmail = async (token: string) => {
    const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token }, false);
    if (response.success) {
      await checkAuth();
    } else {
      throw new Error(response.data?.error || 'Verification failed');
    }
  };

  const verifyPhone = async (token: string) => {
    const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_PHONE, { token });
    if (response.success) {
      await checkAuth();
    } else {
      throw new Error(response.data?.error || 'Phone verification failed');
    }
  };

  const resendVerification = async () => {
    await api.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email: user?.email });
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signup,
    login,
    logout,
    verifyEmail,
    verifyPhone,
    resendVerification,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}