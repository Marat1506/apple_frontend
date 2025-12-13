"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      api.auth
        .getMe()
        .then((userData) => {
          setUser(userData);
        })
        .catch((error) => {
          console.error("Failed to get user profile:", error);
          localStorage.removeItem("auth_token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const data = await api.auth.signUp(email, password, fullName);
      if (data.access_token) {
        localStorage.setItem("auth_token", data.access_token);
        setUser(data.user);
        toast({
          title: "Account created!",
          description: "Welcome to Dubliz Store",
        });
        router.push("/");
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.auth.signIn(email, password);
      if (data.access_token) {
        localStorage.setItem("auth_token", data.access_token);
        setUser(data.user);
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in",
        });
        router.push("/");
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await api.auth.signOut();
      localStorage.removeItem("auth_token");
      setUser(null);
      toast({
        title: "Signed out",
        description: "See you soon!",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

