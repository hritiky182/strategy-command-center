import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, RoleName } from "@/lib/types";
import { useDb } from "@/services/store";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => boolean;
  loginAsRole: (role: RoleName) => void;
  logout: () => void;
  switchRole: (role: RoleName) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = "strategy_command_center_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const db = useDb();
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  const login = (email: string): boolean => {
    const foundUser = db.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    // If demo email, fallback to finding by role or default user
    if (db.users.length > 0) {
      setUser(db.users[0]!);
      return true;
    }
    return false;
  };

  const loginAsRole = (role: RoleName) => {
    const match = db.users.find((u) => u.role === role) ?? {
      id: "USR-DEMO",
      name: `Demo ${role}`,
      email: `${role.toLowerCase().replace(/ /g, ".")}@gov.example`,
      role,
      department: "Digital Government",
      sector: "Digital Government Sector",
      status: "active" as const,
      lastLogin: new Date().toISOString(),
    };
    setUser(match);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: RoleName) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginAsRole,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
