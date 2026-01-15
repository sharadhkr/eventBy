import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import Loading from "../components/Loading";
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div><Loading/></div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
