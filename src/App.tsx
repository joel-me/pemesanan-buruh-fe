import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth-context";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import RegisterFarmerPage from "./pages/RegisterFarmerPage";
import RegisterLaborerPage from "./pages/RegisterLaborerPage";
import LaboreDashboard from "./pages/LaboreDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import CreateOrderPage from "./pages/CreateOrderPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/role" element={<RoleSelectionPage />} />
          <Route path="/register/farmer" element={<RegisterFarmerPage />} />
          <Route path="/register/laborer" element={<RegisterLaborerPage />} />

          {/* Role-Based Dashboards */}
          <Route
            path="/dashboard/farmer"
            element={
              <ProtectedRoute requiredRole="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/laborer"
            element={
              <ProtectedRoute requiredRole="laborer">
                <LaboreDashboard />
              </ProtectedRoute>
            }
          />

          {/* Only farmer can create orders */}
          <Route
            path="/orders/create"
            element={
              <ProtectedRoute requiredRole="farmer">
                <CreateOrderPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
