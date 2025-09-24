import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {
  // If user is null (not authenticated), redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, render the protected content
  return children;
};

export default ProtectedRoute;
