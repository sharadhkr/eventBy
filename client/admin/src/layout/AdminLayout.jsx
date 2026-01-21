import { Outlet } from "react-router-dom";
import { AdminDashboardProvider } from "../context/dashboard";

const AdminLayout = () => (
  <AdminDashboardProvider>
    <div className="min-h-screen bg-gray-100 p-6">
      <Outlet />
    </div>
  </AdminDashboardProvider>
);

export default AdminLayout;
