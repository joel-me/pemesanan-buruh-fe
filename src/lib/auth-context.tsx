import { createContext, ReactNode, useContext, useState, useEffect } from "react";

// Definisikan tipe untuk AuthContext
type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | null;
};

// Membuat context untuk Auth
const AuthContext = createContext<AuthContextType | null>(null);

// Provider untuk AuthContext
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Mengecek apakah token ada di localStorage saat pertama kali komponen dimuat
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Menetapkan isAuthenticated sesuai keberadaan token
  }, []);

  // Fungsi untuk login
  const login = (token: string) => {
    localStorage.setItem("token", token); // Menyimpan token di localStorage
    setIsAuthenticated(true); // Menandakan bahwa pengguna sudah login
  };

  // Fungsi untuk logout
  const logout = () => {
    localStorage.removeItem("token"); // Menghapus token dari localStorage
    setIsAuthenticated(false); // Menandakan bahwa pengguna sudah logout
  };

  // Fungsi untuk mendapatkan token
  const getToken = (): string | null => {
    return localStorage.getItem("token"); // Mengambil token dari localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook untuk mengakses context di dalam komponen
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
