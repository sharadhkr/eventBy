import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Home from "../pages/auth/Home";
import Events from "../pages/auth/Home";
import Tickets from "../pages/auth/Home";
import Profile from "../pages/auth/Home";
import ProtectedRoute from "../middleware/ProtectedRoute";
import MainLayout from "../layouts/NavLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected with Navbar */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment" element={<Profile />} />
        </Route>

        {/* Redirect */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
