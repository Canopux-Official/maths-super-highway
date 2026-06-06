import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface UserPayload {
  userId: string;
  role: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: UserPayload | null;
  token: string | null;
  login: (token: string, userData: unknown) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decoded = jwtDecode<UserPayload & { exp?: number }>(storedToken);
        // Check if token is expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          console.error('Token is expired');
          localStorage.removeItem('authToken');
        } else {
          setUser(decoded);
          setToken(storedToken);
        }
      } catch {
        console.error('Invalid token found in local storage');
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
