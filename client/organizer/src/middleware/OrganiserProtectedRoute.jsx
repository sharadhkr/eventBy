import { Navigate, Outlet } from "react-router-dom";
import { useOrganiserAuth } from "../context/organiser.auth.context";
import { Loader2 } from "lucide-react";

const OrganiserProtectedRoute = () => {
  const { organiser, loading } = useOrganiserAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // ❌ Not logged in
  if (!organiser) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Logged in but disabled → force login page
  if (organiser.isActive === false) {
    sessionStorage.setItem("organiserDisabled", "true");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default OrganiserProtectedRoute;
