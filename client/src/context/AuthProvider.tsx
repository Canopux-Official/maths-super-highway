import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './AuthContext';
import type { UserPayload } from './AuthContext';

const getInitialAuthState = (): { user: UserPayload | null; token: string | null } => {
  const storedToken = localStorage.getItem('authToken');
  if (storedToken) {
    try {
      const user = jwtDecode<UserPayload>(storedToken);
      return { user, token: storedToken };
    } catch {
      localStorage.removeItem('authToken');
    }
  }
  return { user: null, token: null };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialState] = useState(getInitialAuthState);
  const [user, setUser] = useState<UserPayload | null>(initialState.user);
  const [token, setToken] = useState<string | null>(initialState.token);
  const isLoading = false;

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    const decoded = jwtDecode<UserPayload>(newToken);
    setToken(newToken);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
