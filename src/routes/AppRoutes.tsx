import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoutes";
import Pets from "../pages/pet/pets";
import Appointments from "../pages/appointment/appointment";
import MedicalRecords from "../pages/medicalRecord/MedicalRecord";
import Profile from "../pages/profile/profile";
import Register from "../pages/Register";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;