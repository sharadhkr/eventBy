import { Navigate } from "react-router-dom";
import { useOrganiserAuth } from "../context/organiser.auth";

const OrganiserProtectedRoute = ({ children }) => {
  const { organiser, loading } = useOrganiserAuth();

  if (loading) return <div>Loading...</div>;
  if (!organiser) return <Navigate to="/organiser/login" />;

  return children;
};

export default OrganiserProtectedRoute;
