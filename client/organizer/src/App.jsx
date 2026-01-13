import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import OrganiserProtectedRoute from "./middleware/OrganiserProtectedRoute.jsx";
import { OrganiserAuthProvider } from "./context/organiser.auth.context";
import CreateEvent from "./pages/CreateEvent.jsx";
import ManageEvents from "./pages/ManageEvents.jsx";
import EditEvent from "./pages/EditEvent.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <OrganiserAuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/events/create" element={<CreateEvent/>} />
          <Route path="/events/edit/:id" element={<EditEvent/>} />
          <Route path="/events/manage" element={<ManageEvents/>} />

        </Routes>
      </OrganiserAuthProvider>
    </BrowserRouter>
  );
}
