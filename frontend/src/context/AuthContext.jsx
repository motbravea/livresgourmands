import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('lg_token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('lg_user');
    return stored ? JSON.parse(stored) : null;
  });

  // Hydrate user from token if missing or stale
  useEffect(() => {
    if (token && !user) {
      const decoded = decodeJwt(token);
      if (decoded) {
        const u = { id: decoded.id, role: decoded.role };
        setUser(u);
        localStorage.setItem('lg_user', JSON.stringify(u));
      }
    }
  }, [token, user]);

  const login = useCallback(async ({ email, password }) => {
    const data = await authApi.login({ email, password });
    if (!data.token) throw new Error('Token manquant dans la réponse.');
    const decoded = decodeJwt(data.token) || {};
    const u = { id: decoded.id, role: decoded.role, email };
    localStorage.setItem('lg_token', data.token);
    localStorage.setItem('lg_user', JSON.stringify(u));
    setToken(data.token);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async ({ nom, email, password }) => {
    return authApi.register({ nom, email, password });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('lg_token');
    localStorage.removeItem('lg_user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token;
  const isAdmin =
    user?.role === 'administrateur' ||
    user?.role === 'gestionnaire' ||
    user?.role === 'editeur';

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, isAdmin, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
}
