// client/src/middleware/OrganiserProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useOrganiserAuth } from "../context/organiser.auth.context";
import { Loader2 } from "lucide-react";

const OrganiserProtectedRoute = () => {
  const { organiser, loading } = useOrganiserAuth();

  if (loading) return <Loader2 className="animate-spin" />;

  if (!organiser) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default OrganiserProtectedRoute;