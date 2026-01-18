import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Home from "../pages/Home";
import ProtectedRoute from "../middleware/ProtectedRoute";
import MainLayout from "../layouts/NavLayout";
import EditProfile from "../pages/EditProfilepage";
import ProfilePage from "../pages/profile/ProfilePage";
import JoinEventPage from "../pages/JoinEventPage";
import EventMapPage from "../pages/EventMapPage";
import UserEvents from "../pages/UserEvents";

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
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/map" element={<EventMapPage/>} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/events/:id" element={<JoinEventPage/>} />
          <Route path="/events" element={<UserEvents/>} />
        </Route>

        {/* Redirect */}
        {/* <Route path="*" element={<Navigate to="/home" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
