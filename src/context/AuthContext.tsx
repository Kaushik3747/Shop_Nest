import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "@/types";
import { mockDemoUser, mockAdminUser } from "@/data/mockData";
import { DEMO_ADMIN, DEMO_USER } from "@/constants";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("shopnest_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("shopnest_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    
    let loggedInUser: User | null = null;
    
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      loggedInUser = mockAdminUser;
    } else if (email === DEMO_USER.email && password === DEMO_USER.password) {
      loggedInUser = mockDemoUser;
    } else {
      // Simulate any user can log in (demo mode)
      const storedUsers: User[] = JSON.parse(localStorage.getItem("shopnest_registered_users") || "[]");
      const found = storedUsers.find((u) => u.email === email);
      if (found) {
        loggedInUser = found;
      }
    }

    setIsLoading(false);

    if (loggedInUser) {
      setUser(loggedInUser);
      localStorage.setItem("shopnest_user", JSON.stringify(loggedInUser));
      toast.success(`Welcome back, ${loggedInUser.name.split(" ")[0]}!`);
      return true;
    }

    toast.error("Invalid email or password");
    return false;
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const newUser: User = {
      ...mockDemoUser,
      id: `u_${Date.now()}`,
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f59e0b&color=fff`,
      role: "customer",
      createdAt: new Date().toISOString(),
    };

    const storedUsers: User[] = JSON.parse(localStorage.getItem("shopnest_registered_users") || "[]");
    storedUsers.push(newUser);
    localStorage.setItem("shopnest_registered_users", JSON.stringify(storedUsers));

    setUser(newUser);
    localStorage.setItem("shopnest_user", JSON.stringify(newUser));
    setIsLoading(false);
    toast.success(`Welcome to ShopNest, ${name.split(" ")[0]}!`);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("shopnest_user");
    toast.success("Logged out successfully");
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("shopnest_user", JSON.stringify(updated));
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin" || user?.role === "manager",
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
