'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/lib/types';
import api, { getCurrentUser, clearAuthTokens } from '@/lib/api/client';
import { Loading } from '@/components/ui/Card';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  locale: string;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  requireAuth = false,
  allowedRoles = [],
  locale,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        
        // Check role-based access
        if (requireAuth && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
          router.push(`/${locale}/auth/login`);
          return;
        }
      } else if (requireAuth) {
        router.push(`/${locale}/auth/login`);
        return;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      if (requireAuth) {
        router.push(`/${locale}/auth/login`);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    const response = await api.getMe();
    if (response.success && response.data) {
      setUser(response.data);
    }
  };

  const logout = async () => {
    await api.logout();
    clearAuthTokens();
    setUser(null);
    router.push(`/${locale}/auth/login`);
  };

  if (loading && requireAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Loading..." />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
