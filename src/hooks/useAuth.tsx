// src/hooks/useAuth.tsx
import { useState } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  const login = (userData: { name: string }) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
  };

  const getToken = () => {
    return localStorage.getItem('token') || '';
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    getToken, // ✅ pastikan ini dikembalikan
  };
};
export type Order = {
    id: string;
    description: string;
    createdAt: string;
    status: "pending" | "accepted" | "completed" | "cancelled";
    farmerId: string;
    laborerId: string;
    laborer?: {
      id: string;
      name: string;
    };
  };
  