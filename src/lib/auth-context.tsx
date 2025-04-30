import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Tipe user yang disimpan
type User = {
  id: string;
  username: string;
  role: "farmer" | "laborer";
};

// Tipe untuk konteks autentikasi
type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  getToken: () => string | null;
};

// Inisialisasi context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider untuk membungkus aplikasi dan menyediakan auth context
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const isAuthenticated = !!token && !!user;

  // Inisialisasi state dari localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load auth data:", error);
    }
  }, []);

  // Login: simpan data ke state dan localStorage
  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  // Logout: hapus data dari state dan localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Ambil token untuk request ke server
  const getToken = () => {
    return token;
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, logout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook untuk menggunakan AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
