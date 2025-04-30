// ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context"; // Import hook useAuth

interface ProtectedRouteProps {
  children: ReactNode; // Komponen yang dibungkus oleh ProtectedRoute
  requiredRole?: "farmer" | "laborer"; // Role yang diperlukan untuk mengakses halaman
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, token } = useAuth(); // Ambil user dan token dari context

  // Jika token atau user tidak ada, arahkan ke halaman login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Jika role tidak sesuai dengan yang dibutuhkan, arahkan ke dashboard sesuai role
  if (requiredRole && user.role !== requiredRole) {
    if (user.role === "farmer") {
      return <Navigate to="/dashboard/farmer" replace />;
    }
    if (user.role === "laborer") {
      return <Navigate to="/dashboard/laborer" replace />;
    }
  }

  // Jika role cocok, tampilkan halaman yang dibungkus
  return <>{children}</>;
}
