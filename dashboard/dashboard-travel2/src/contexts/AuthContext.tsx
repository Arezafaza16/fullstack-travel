import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin';
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isOwner: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phoneNumber: number) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const LS_TOKEN_KEY = 'td_token';
const LS_USER_KEY = 'td_user';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(LS_TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(LS_USER_KEY);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  });

  const persist = (t: string, u: AuthUser) => {
    localStorage.setItem(LS_TOKEN_KEY, t);
    localStorage.setItem(LS_USER_KEY, JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login gagal');
    persist(data.access_token, data.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, phoneNumber: number) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phoneNumber }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registrasi gagal');
    persist(data.access_token, data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(LS_TOKEN_KEY);
    localStorage.removeItem(LS_USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token && !!user,
      isOwner: user?.role === 'owner',
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
