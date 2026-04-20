import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AdminDashboardProvider } from "../context/dashboard";
import { LogOut, LayoutDashboard, TrendingUp, Users, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Top Events", path: "/top-events", icon: TrendingUp },
    { label: "Organisers", path: "/organisers", icon: Users },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <AdminDashboardProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
          )}
        </AnimatePresence>

        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          exit={{ x: -300 }}
          transition={{ duration: 0.3 }}
          className="fixed md:static w-64 h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white shadow-xl z-50 overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
                EventBy
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-white hover:bg-white/20 p-2 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <motion.button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? "bg-white/20 border-l-4 border-blue-400"
                      : "hover:bg-white/10"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-semibold">{item.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={() => {
                localStorage.removeItem("adminToken");
                navigate("/login");
              }}
              className="w-full flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 px-4 py-3 rounded-lg transition-all"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-gray-800 font-semibold hidden md:block">Admin Console</h2>
            <div className="text-gray-600 text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardProvider>
  );
};

export default AdminLayout;
