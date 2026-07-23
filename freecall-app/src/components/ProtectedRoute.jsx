import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useApp();
  const location = useLocation();

  // If user is set or session token exists, allow access
  const isAuthenticated = Boolean(user?.email || localStorage.getItem("freecall_token"));

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
