import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";

interface ProtectedRouteProps {
  children: ReactNode; // Komponen anak yang akan dibungkus oleh ProtectedRoute
  requiredRole?: "farmer" | "laborer"; // Role yang diperlukan untuk mengakses halaman
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, token } = useAuth(); // Mengambil data user dan token dari context

  // Cek apakah token dan user ada
  if (!token || !user) {
    // Jika tidak ada token atau user, arahkan ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika role diperlukan, cek apakah role pengguna sesuai
  if (requiredRole && user.role !== requiredRole) {
    // Jika role pengguna tidak sesuai, arahkan ke halaman dashboard default
    return <Navigate to="/dashboard" replace />;
  }

  // Jika pengguna terautentikasi dan memiliki role yang sesuai, tampilkan children (halaman yang dibungkus)
  return <>{children}</>;
}
