import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const data = await authAPI.getSession();
      if (data && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name, additionalData = {}) => {
    try {
      const data = await authAPI.signup(email, password, name, additionalData);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signin = async (email, password) => {
    try {
      const data = await authAPI.signin(email, password);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signout = async () => {
    try {
      await authAPI.signout();
      setUser(null);
    } catch (error) {
      console.error('Signout failed:', error);
    }
  };

  const value = {
    user,
    loading,
    signup,
    signin,
    signout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

