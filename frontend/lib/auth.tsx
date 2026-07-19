"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  user_id: string;
  name: string;
  email: string;
  subscription_tier: string;
  plans_used_this_month: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const applySubscriptionBypass = (u: User | null) => {
    if (!u) return u;
    // Always give premium access to disable all paywalls permanently
    return { ...u, subscription_tier: "premium" };
  };

  useEffect(() => {
    // Check for token on mount
    const storedToken = localStorage.getItem("finwise_token");
    const storedUser = localStorage.getItem("finwise_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(applySubscriptionBypass(JSON.parse(storedUser)));
      // Optionally refresh user here
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(applySubscriptionBypass(newUser));
    localStorage.setItem("finwise_token", newToken);
    localStorage.setItem("finwise_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("finwise_token");
    localStorage.removeItem("finwise_user");
    router.push("/");
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(applySubscriptionBypass(userData));
        localStorage.setItem("finwise_user", JSON.stringify(userData));
      } else if (res.status === 401) {
        logout();
      }
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
