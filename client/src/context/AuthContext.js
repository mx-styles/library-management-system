import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setCurrentUser(null);
        } else {
          setCurrentUser({
            username: decoded.sub,
            isAdmin: decoded.is_admin || false
          });
        }
      } catch (error) {
        localStorage.removeItem('token');
        setCurrentUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      const data = await authService.login(username, password);
      const decoded = jwtDecode(data.access_token);
      setCurrentUser({
        username: decoded.sub,
        isAdmin: decoded.is_admin || false
      });
      return true;
    } catch (error) {
      setError(error.response?.data?.detail || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      await authService.register(userData);
      return true;
    } catch (error) {
      setError(error.response?.data?.detail || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
