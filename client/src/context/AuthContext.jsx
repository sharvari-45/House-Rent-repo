import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('house_rent_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('house_rent_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('house_rent_token', token);
    } else {
      localStorage.removeItem('house_rent_token');
    }
  }, [token]);

  // Sync user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('house_rent_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('house_rent_user');
    }
  }, [user]);

  // Verify and fetch fresh user profile on initial mount
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.warn('[AuthContext] Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('house_rent_token');
    localStorage.removeItem('house_rent_user');
  };

  const updateProfile = async (data) => {
    const res = await api.put('/auth/profile', data);
    if (res.data.success) {
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Update failed');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'Admin',
        isOwner: user?.role === 'Property Owner',
        isTenant: user?.role === 'Tenant',
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
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
