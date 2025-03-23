import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../dataTypes";
import { login as loginAPI, signup as signupAPI } from "../utils/authMethods";



// Define AuthContext Type
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

// Create Context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Signup function
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
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Login function
  const login = async (
    email: string,
    password: string,
    setError: (error: string) => void,
    navigate: (path: string) => void
  ) => {
    try {
      const userData = await loginAPI(email, password, setError, navigate);
      setUser(userData); 
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
