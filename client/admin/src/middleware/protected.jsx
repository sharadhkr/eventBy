import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/admin";

const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();

  if (loading) return <div>Loading...</div>;

  if (!admin) return <Navigate to="/login" replace />;

  return children;
};

export default AdminProtectedRoute;
