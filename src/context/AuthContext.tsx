
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  institute?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, institute: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    
    setIsLoading(false);
  }, []);

  // Mock API functions (replace with actual API calls)
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Mock response - replace with actual API call
      const mockResponse = {
        user: {
          _id: "user123",
          name: "John Doe",
          email,
          role: email.includes("admin") ? "admin" : "user",
          institute: "Demo Institute"
        },
        token: "mock-jwt-token"
      };
      
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(mockResponse.user));
      localStorage.setItem("token", mockResponse.token);
      
      // Update state
      setUser(mockResponse.user as User);
      setToken(mockResponse.token);
      
      toast.success("Login successful");
      
      // Redirect based on role
      if (mockResponse.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, institute: string) => {
    try {
      setIsLoading(true);
      
      // Mock response - replace with actual API call
      const mockResponse = {
        user: {
          _id: "user" + Math.floor(Math.random() * 1000),
          name,
          email,
          role: "user",
          institute
        },
        token: "mock-jwt-token-new-user"
      };
      
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(mockResponse.user));
      localStorage.setItem("token", mockResponse.token);
      
      // Update state
      setUser(mockResponse.user as User);
      setToken(mockResponse.token);
      
      toast.success("Registration successful");
      navigate("/user-dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Reset state
    setUser(null);
    setToken(null);
    
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
