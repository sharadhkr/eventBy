import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Home from "../pages/Home";
import Events from "../pages/Home";
import Tickets from "../pages/Home";
import Profile from "../pages/Home";
import ProtectedRoute from "../middleware/ProtectedRoute";
import MainLayout from "../layouts/NavLayout";
import EditProfile from "../pages/EditProfilepage";
import ProfilePage from "../pages/profile/ProfilePage";

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
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/editprofile" element={<EditProfile/>} />
        </Route>

        {/* Redirect */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
