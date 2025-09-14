'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
  isAuthenticated: false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const logout = () => {
    setUserState(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Add any additional cleanup
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser: (newUser) => {
        setUserState(newUser);
        if (newUser) {
          localStorage.setItem('user', JSON.stringify(newUser));
        } else {
          localStorage.removeItem('user');
        }
      },
      token,
      setToken: (newToken) => {
        setToken(newToken);
        if (newToken) {
          localStorage.setItem('token', newToken);
        } else {
          localStorage.removeItem('token');
        }
      },
      isAuthenticated: !!user && !!token,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
