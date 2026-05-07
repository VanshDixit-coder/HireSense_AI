import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('hiresense_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  const logout = useCallback(() => {
    localStorage.removeItem('hiresense_token');
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback((nextToken, nextUser) => {
    localStorage.setItem('hiresense_token', nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem('hiresense_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await authApi.me();
      setToken(storedToken);
      setUser(data.user);
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    window.addEventListener('hiresense:unauthorized', logout);
    return () => window.removeEventListener('hiresense:unauthorized', logout);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      refreshUser,
      isAuthenticated: Boolean(token && user)
    }),
    [user, token, loading, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
