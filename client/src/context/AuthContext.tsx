import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, LoginInput, SignupInput } from '../lib/schemas';
import { loginUser, registerUser, logoutUser, checkAuth } from '../services/auth.service';
import { AxiosError } from 'axios';
import type { ApiError } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  signup: (data: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on mount
  const { data: authData, isLoading: isCheckingAuth } = useQuery({
    queryKey: ['auth'],
    queryFn: checkAuth,
    retry: false,
    enabled: !!localStorage.getItem('accessToken'),
  });

  // Get user from local storage or auth check
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Update user when auth check completes
  useEffect(() => {
    if (authData?.success && authData.data?.user) {
      setUser(authData.data.user);
      localStorage.setItem('user', JSON.stringify(authData.data.user));
    }
  }, [authData]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { accessToken, user } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setError(null);
        queryClient.invalidateQueries({ queryKey: ['auth'] });
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      throw new Error(message);
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setError(null);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      queryClient.clear();
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      queryClient.clear();
    },
  });

  const login = async (data: LoginInput) => {
    await loginMutation.mutateAsync(data);
  };

  const signup = async (data: SignupInput) => {
    await signupMutation.mutateAsync(data);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: isCheckingAuth || loginMutation.isPending || signupMutation.isPending,
    login,
    signup,
    logout,
    error,
    clearError,
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
