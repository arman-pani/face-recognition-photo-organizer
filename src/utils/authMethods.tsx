import axios from "axios";
import { User } from "../dataTypes";

const API_URL = "http://localhost:5000/api/auth";

export const signup = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  agreed: boolean,
  setError: (error: string) => void,
  navigate: (path: string) => void
): Promise<User | null> => {
  try {
    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return null;
    }

    // Check if the user agreed to terms
    if (!agreed) {
      setError("You must agree to the terms and conditions.");
      return null;
    }

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Signup failed");
    }

    const userData: User = await response.json();
    navigate("/dashboard");
    return userData;
  } catch (error: any) {
    setError(error.message);
    throw error;
  }
};


export const login = async (
  email: string,
  password: string,
  setError: (error: string) => void,
  navigate: (path: string) => void
): Promise<User> => {
  setError(""); 

  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    const userData: User = response.data.user; 
    localStorage.setItem("token", response.data.token);
    navigate("/dashboard");

    return userData; 
  } catch (error: any) {
    setError(error.response?.data?.message || "Something went wrong");
    throw error; 
  }
};

