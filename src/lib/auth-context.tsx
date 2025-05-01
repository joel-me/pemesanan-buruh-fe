import { createContext, ReactNode, useContext, useState, useEffect } from "react";

// Define the AuthContext type
type AuthContextType = {
  isAuthenticated: boolean;
  user: { id: number; username: string; role: 'farmer' | 'laborer' } | null;
  token: string | null;
  login: (user: { id: number; username: string; role: 'farmer' | 'laborer' }, token: string) => void;
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

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Gagal parsing user dari localStorage:", err);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (user: { id: number; username: string; role: 'farmer' | 'laborer' }, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

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
