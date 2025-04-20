import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../dataTypes";
import { login as loginAPI, signup as signupAPI } from "../utils/authMethods";

// Define the shape of AuthContext
interface AuthContextType {
  user: User | null;
  signup: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    agreed: boolean,
    setError: (error: string) => void,
    navigate: (path: string) => void
  ) => Promise<void>;
  login: (
    email: string,
    password: string,
    setError: (error: string) => void,
    navigate: (path: string) => void
  ) => Promise<void>;
  logout: () => void;
}

// Create Context
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook for easy use
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save user to localStorage when changed
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Signup logic
  const signup = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    agreed: boolean,
    setError: (error: string) => void,
    navigate: (path: string) => void
  ) => {
    try {
      const userData = await signupAPI(name, email, password, confirmPassword, agreed, setError, navigate);
      setUser(userData);
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Login logic
  const login = async (
    email: string,
    password: string,
    setError: (error: string) => void,
    navigate: (path: string) => void
  ) => {
    try {
      const userData = await loginAPI(email, password, setError, navigate);
      setUser(userData);
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Logout logic
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
