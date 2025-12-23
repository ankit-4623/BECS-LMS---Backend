import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import authService, { type User } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const clearAuth = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      if (!token) {
        clearAuth();
        return;
      }

      // Attach token globally
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Restore user instantly (prevents UI flicker)
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const response = await authService.checkAuth();

      if (response.success && response.data.user?.role === 'admin') {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        clearAuth();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuth();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({
        userEmail: email,
        password,
      });

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const { accessToken, user: userData } = response.data;

      if (userData.role !== 'admin') {
        throw new Error('Access denied. Only admins can access this panel.');
      }

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      setUser(userData);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      clearAuth();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!localStorage.getItem('accessToken'),
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
