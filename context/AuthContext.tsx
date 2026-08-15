'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'mini_shop_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      if (raw) {
        setUser(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Error loading user from localStorage', e);
    }
  }, []);

  const login = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'admin@minishop.vn' && pass === 'admin123') {
      const adminUser: User = { name: 'Admin Shop', email: cleanEmail, role: 'admin' };
      setUser(adminUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(adminUser));
      return true;
    } else if (cleanEmail && pass) {
      const regularUser: User = {
        name: cleanEmail.split('@')[0] || 'Khách hàng',
        email: cleanEmail,
        role: 'user',
      };
      setUser(regularUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(regularUser));
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, pass: string): boolean => {
    if (name && email && pass) {
      const newUser: User = { name, email, role: 'user' };
      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
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
