import { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { authAPI, tokenStorage } from '../utils/auth.js';

const defaultAuthContext = {
  user: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  signup: async () => {
    throw new Error('AuthProvider is not ready yet. Please wait for initialization.');
  },
  signin: async () => {
    throw new Error('AuthProvider is not ready yet. Please wait for initialization.');
  },
  signout: async () => {
    throw new Error('AuthProvider is not ready yet. Please wait for initialization.');
  },
};

const AuthContext = createContext(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasCheckedSessionRef = useRef(false);
  const isCheckingSessionRef = useRef(false);

  useEffect(() => {
    // Only check session once on mount
    if (!hasCheckedSessionRef.current && !isCheckingSessionRef.current) {
      hasCheckedSessionRef.current = true;
      isCheckingSessionRef.current = true;
      checkSession();
    }
  }, []);

  // Ensure loading is false if we have a user (e.g., after signin)
  useEffect(() => {
    if (user && loading) {
      setLoading(false);
    }
  }, [user, loading]);

  const checkSession = async () => {
    // Prevent multiple simultaneous session checks
    if (isCheckingSessionRef.current && hasCheckedSessionRef.current) {
      return;
    }
    
    try {
      isCheckingSessionRef.current = true;
      
      // Add a fallback timeout to ensure loading state doesn't hang forever
      const timeoutId = setTimeout(() => {
        if (isCheckingSessionRef.current) {
          console.warn('Session check taking too long, setting loading to false');
          setLoading(false);
          isCheckingSessionRef.current = false;
        }
      }, 10000); // Reduced to 10 seconds to match getSession timeout
      
      const data = await authAPI.getSession();
      clearTimeout(timeoutId);
      
      if (data && data.user) {
        setUser(data.user);
      } else {
        // If no user data, clear user state
        setUser(null);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Session check failed:', error);
      }
      setUser(null);
    } finally {
      // Always set loading to false, even if there was an error
      setLoading(false);
      isCheckingSessionRef.current = false;
    }
  };

  const signup = async (email, password, name, additionalData = {}) => {
    try {
      const data = await authAPI.signup(email, password, name, additionalData);
      setUser(data.user);
      // Ensure loading is set to false after successful signup
      setLoading(false);
      return data;
    } catch (error) {
      // Ensure loading is set to false even on error
      setLoading(false);
      throw error;
    }
  };

  const signin = async (email, password) => {
    try {
      const data = await authAPI.signin(email, password);
      setUser(data.user);
      // Ensure loading is set to false after successful signin
      setLoading(false);
      return data;
    } catch (error) {
      // Ensure loading is set to false even on error
      setLoading(false);
      throw error;
    }
  };

  const signout = async () => {
    try {
      await authAPI.signout();
      setUser(null);
      tokenStorage.remove();
    } catch (error) {
      console.error('Signout failed:', error);
      // Always clear user and token even if request fails
      setUser(null);
      tokenStorage.remove();
    }
  };

  const value = useMemo(() => ({
    user,
    loading,
    signup,
    signin,
    signout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

