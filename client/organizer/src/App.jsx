// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import { OrganiserAuthProvider } from "./context/organiser.auth.context";
import OrganiserProtectedRoute from "./middleware/OrganiserProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import ManageEvents from "./pages/ManageEvents";
import EditEvent from "./pages/EditEvent";
import EditProfile from "./pages/EditProfile";
import Analytics from "./pages/Analytics";
import EventAnnouncements from "./pages/EventAnnouncements";

export default function App() {
  return (
    <BrowserRouter>
      <OrganiserAuthProvider>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<OrganiserProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/events/manage" element={<ManageEvents />} />
            <Route path="/events/edit/:id" element={<EditEvent />} />
            <Route path="//events/:id/announcements" element={<EventAnnouncements/>} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </OrganiserAuthProvider>
    </BrowserRouter>
  );
}