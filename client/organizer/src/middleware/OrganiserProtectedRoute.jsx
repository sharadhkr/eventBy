import { Navigate } from "react-router-dom";
import { useOrganiserAuth } from "../context/organiser.auth.context";

const OrganiserProtectedRoute = ({ children }) => {
  const { isAuth, loading } = useOrganiserAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default OrganiserProtectedRoute;
