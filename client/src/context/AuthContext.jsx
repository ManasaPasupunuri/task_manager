// ──────────────────────────────────────────────
// Auth Context
// ──────────────────────────────────────────────
// Provides auth state (user, token, loading) and
// actions (login, signup, logout) to the whole app.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // On mount or token change, fetch the current user
  useEffect(() => {
    if (token) {
      authApi.getMe()
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          // Token invalid/expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    const { user: userData, token: newToken } = res.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const res = await authApi.signup({ name, email, password });
    const { user: userData, token: newToken } = res.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const value = { user, token, loading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
