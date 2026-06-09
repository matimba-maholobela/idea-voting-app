// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { authService } from '../api/auth.service';
import { 
  storeToken, 
  getToken, 
  clearTokens, 
  isAuthenticated as checkAuth,
  setUser as setStoredUser,
  getUser as getStoredUser
} from '../utils/tokenManager';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (hasChecked.current) return;
      hasChecked.current = true;
      
      const token = getToken('access_token');
      const storedUser = getStoredUser();
      
      if (!token) {
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }
      
      // If we have a token, try to get user profile
      try {
        const response = await authService.getProfile();
        setUser(response.data);
        setStoredUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        // Only clear if it's an auth error
        if (error.response?.status === 401) {
          clearTokens();
        }
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Logging in with:', { username, password });
      const response = await authService.login(username, password);
      console.log('Login response:', response.data);
      
      const { access_token, refresh_token, user: userData } = response.data;
      
      // Store tokens directly (no encryption)
      storeToken('access_token', access_token);
      storeToken('refresh_token', refresh_token);
      setStoredUser(userData);
      
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login error:', error.response?.data);
      toast.error(error.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const logout = async () => {
    const refreshToken = getToken('refresh_token');
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};