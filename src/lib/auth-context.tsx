import { createContext, ReactNode, useContext, useState, useEffect } from "react";

// Define the AuthContext type
type AuthContextType = {
  isAuthenticated: boolean;
  user: { id: string; username: string; role: 'farmer' | 'laborer' } | null;
  token: string | null;
  login: (user: { id: string; username: string; role: 'farmer' | 'laborer' }, token: string) => void;
  logout: () => void;
  getToken: () => string | null;
};

// Create AuthContext
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider to manage authentication state
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [token, setToken] = useState<string | null>(null);

  // Check if token exists in localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Login function to set token and user data
  const login = (user: { id: string; username: string; role: 'farmer' | 'laborer' }, token: string) => {
    localStorage.setItem("token", token); 
    localStorage.setItem("user", JSON.stringify(user)); 
    setToken(token);
    setUser(user);
    setIsAuthenticated(true); // Mark as authenticated
  };

  // Logout function to clear token and user data
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false); // Mark as not authenticated
  };

  // Get token from localStorage
  const getToken = (): string | null => {
    return localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the AuthContext in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
