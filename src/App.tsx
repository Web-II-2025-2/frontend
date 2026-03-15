import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ControlPanel } from "./pages/employee/ControlPanel";
import { EventManagement } from "./pages/employee/EventManagement"; 
import { RoomManagement } from "./pages/employee/RoomManagement";
import { EmployeeManagement } from "./pages/employee/EmployeeManagement";
import { RoomList } from "./pages/employee/RoomList"; 
import { AuthProvider } from "./services/AuthContext";
import ProtectedRoute from "./services/ProtectedRoute";

import "./styles/global.css"; 

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'EMPLOYEE']} />}>
            <Route element={<ControlPanel />}>
              <Route path="/event" element={<EventManagement />} />
              <Route path="/room" element={<RoomManagement />} />
              <Route path="/employees/new" element={<EmployeeManagement />} />
              <Route path="/rooms" element={<RoomList />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['GUEST']} />}>
            <Route path="/guest/dashboard" element={<div>Dashboard do Hóspede</div>} />
          </Route>

          <Route path="/unauthorized" element={<h1>Acesso Negado</h1>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}