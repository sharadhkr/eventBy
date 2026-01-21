import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "./context/admin";
import AdminLogin from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./middleware/protected";
import AdminLayout from "./layout/AdminLayout";
import { Toaster } from "react-hot-toast";
import AdminTopEvents from "./pages/Topevents";
import { AdminTopEventsProvider } from "./context/Topevent";
import AdminOrganisers from "./pages/AdminOrganisers";


function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<AdminLogin />} />

          <Route
            path="/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
          </Route>
          <Route
            path="/top-events"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminTopEventsProvider><AdminTopEvents /></AdminTopEventsProvider>} />
          </Route>
          <Route
            path="/organisers"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminOrganisers/>} />
          </Route>


        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
