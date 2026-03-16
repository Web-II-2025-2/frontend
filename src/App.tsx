import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AuthProvider } from "./services/AuthContext";
import LandingPage from "@/pages/LandingPage";
import { ProfilePage } from "./components/layout/ProfilePage";
import "./styles/global.css"; 
import ProtectedRoute from "./services/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/reservations" element={<ProfilePage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/unauthorized" element={<h1>Você não tem permissão para acessar esta área.</h1>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}