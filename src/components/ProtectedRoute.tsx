"use client";

import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "farmer" | "laborer";
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect ke dashboard yang sesuai dengan rolenya
    const redirectPath = user.role === "farmer" ? "/dashboard/farmer" : "/dashboard/laborer";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
