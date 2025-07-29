import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginUser } from '@/lib/api';

export type UserRole = 'Admin' | 'Agent' | 'Customer';

export type User = {
  id: number;
  email: string;
  name?: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
};

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: true,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const navigate = useNavigate();
  
  const updateState = (updates: Partial<AuthState>) => {
    setState(prev => ({
      ...prev,
      ...updates,
    }));
  };

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        updateState({ isLoading: false });
        return;
      }

      try {
        const response = await axios.get('/api/auth/me', {
          headers: { 
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        updateState({
          user: response.data,
          token: storedToken,
          isLoading: false
        });
      } catch (error) {
        console.error('Failed to load user', error);
        localStorage.removeItem('token');
        updateState({
          user: null,
          token: null,
          isLoading: false
        });
      }
    };

    loadUser();
  }, []);
          // If token is invalid or expired, clear it
  

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      updateState({ isLoading: true });
      const response = await loginUser({ 
        userName: email, 
        password 
      });
      
      // Update all state at once
      updateState({
        user: response.user,
        token: response.token,
        isLoading: false
      });
      
      // Update localStorage after state is updated
      localStorage.setItem('token', response.token);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
      }
      throw error;
    } finally {
      updateState({ isLoading: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    updateState({
      user: null,
      token: null,
      isLoading: false
    });
    navigate('/login');
  };

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: !!state.token,
    isLoading: state.isLoading,
    login,
    logout,
  };
  
  console.log('Auth state updated:', value);

  return (
    <AuthContext.Provider value={value}>
      {!state.isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
