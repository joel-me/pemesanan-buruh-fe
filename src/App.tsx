import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./lib/auth-context"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RoleSelectionPage from "./pages/RoleSelectionPage"
import RegisterFarmerPage from "./pages/RegisterFarmerPage"
import RegisterLaborerPage from "./pages/RegisterLaborerPage"
import LaboreDashboard from "./pages/LaboreDashboard"
import FarmerDashboard from "./pages/FarmerDashboard"
import CreateOrderPage from "./pages/CreateOrderPage"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/role" element={<RoleSelectionPage />} />
          <Route path="/register/farmer" element={<RegisterFarmerPage />} />
          <Route path="/register/laborer" element={<RegisterLaborerPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <LaboreDashboard />
                <FarmerDashboard/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/create"
            element={
              <ProtectedRoute requiredRole="farmer">
                <CreateOrderPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
