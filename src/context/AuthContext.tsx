import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export type UserRole = "customer" | "vendor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: { name: string; email: string; password: string; role?: UserRole }) => Promise<void>;
}

interface StoredUser extends User {
  password: string;
}

const STORAGE_KEY = "silqcommerce_users";
const ACTIVE_USER_KEY = "silqcommerce_active_user";

const seedUsers: StoredUser[] = [
  {
    id: "user-admin",
    name: "Ava Loren",
    email: "admin@silqcommerce.com",
    password: "Admin@123",
    role: "admin",
  },
  {
    id: "user-vendor",
    name: "Noah Sinclair",
    email: "vendor@silqcommerce.com",
    password: "Vendor@123",
    role: "vendor",
  },
];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getStoredUsers = (): StoredUser[] => {
  if (typeof window === "undefined") {
    return [...seedUsers];
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as StoredUser[];
      return [...seedUsers, ...parsed.filter((u) => !seedUsers.some((s) => s.email === u.email))];
    }
  } catch {
    // ignore parsing issues
  }
  return [...seedUsers];
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUsers(getStoredUsers());
    const rawUser = localStorage.getItem(ACTIVE_USER_KEY);
    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(users.filter((u) => !seedUsers.some((seed) => seed.email === u.email)))
    );
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY);
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!match || match.password !== password) {
      toast.error("Invalid credentials");
      throw new Error("Invalid credentials");
    }
    const authUser: User = { id: match.id, name: match.name, email: match.email, role: match.role };
    setUser(authUser);
    toast.success(`Welcome back, ${authUser.name.split(" ")[0]}!`);
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
    toast.info("You have been signed out.");
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string; role?: UserRole }) => {
    const exists = users.some((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
      toast.error("An account with this email already exists.");
      throw new Error("Email already in use");
    }
    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      role: data.role ?? "customer",
    };
    setUsers((prev) => [...prev, newUser]);
    toast.success("Account created! Please sign in.");
  }, [users]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      register,
    }),
    [user, isLoading, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

