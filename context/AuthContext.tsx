'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface AuthResult {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<AuthResult>;
  register: (name: string, email: string, pass: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const mapUser = (sbUser: SupabaseUser): User => {
    const fullName =
      sbUser.user_metadata?.full_name ||
      sbUser.user_metadata?.name ||
      sbUser.email?.split('@')[0] ||
      'Khách hàng';
    const role =
      sbUser.email?.toLowerCase() === 'admin@minishop.vn' ||
      sbUser.app_metadata?.role === 'admin' ||
      sbUser.user_metadata?.role === 'admin'
        ? 'admin'
        : 'user';

    return {
      id: sbUser.id,
      email: sbUser.email || '',
      name: fullName,
      role: role,
    };
  };

  useEffect(() => {
    const supabase = createClient();

    // Check initial active session from Supabase Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapUser(session.user));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for real-time auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapUser(session.user));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string): Promise<AuthResult> => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });

    if (error) {
      let friendlyMsg = error.message;
      if (error.message.includes('Invalid login credentials')) {
        friendlyMsg = 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.';
      } else if (error.message.includes('Email not confirmed')) {
        friendlyMsg = 'Email chưa được xác nhận trong hệ thống.';
      }
      return { success: false, message: friendlyMsg };
    }

    if (data.user) {
      setUser(mapUser(data.user));
    }

    return { success: true };
  };

  const register = async (name: string, email: string, pass: string): Promise<AuthResult> => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: pass,
      options: {
        data: {
          full_name: name.trim(),
        },
      },
    });

    if (error) {
      let friendlyMsg = error.message;
      if (error.message.includes('User already registered')) {
        friendlyMsg = 'Email này đã được đăng ký trước đó. Vui lòng dùng email khác hoặc Đăng nhập.';
      } else if (error.message.includes('Password should be at least')) {
        friendlyMsg = 'Mật khẩu phải có ít nhất 6 ký tự.';
      }
      return { success: false, message: friendlyMsg };
    }

    if (data.user) {
      setUser(mapUser(data.user));
    }

    return { success: true };
  };

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
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
