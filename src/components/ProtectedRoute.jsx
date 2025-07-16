import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <Loader />;
  }

  // If not authenticated, redirect to home page with login modal trigger
  if (!user) {
    // Store the attempted location so we can redirect back after login
    return (
      <Navigate to="/" state={{ from: location, openLogin: true }} replace />
    );
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
