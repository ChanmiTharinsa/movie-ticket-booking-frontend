import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import api from "../api/api";
import type { AuthResponse, Role, SignInRequest, SignUpRequest } from "../types/auth";

interface AuthUser {
  userId: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  signIn: (data: SignInRequest) => Promise<void>;
  signUp: (data: SignUpRequest) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser);

  const signIn = async (data: SignInRequest) => {
    const res = await api.post<AuthResponse>("/auth/signin", data);
    const { token, userId, email, role } = res.data;
    const loggedIn = { userId, email, role };
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(loggedIn));
    setUser(loggedIn);
  };

  const signUp = async (data: SignUpRequest) => {
    await api.post("/auth/signup", data);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}