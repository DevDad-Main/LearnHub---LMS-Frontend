import { Navigate } from "react-router-dom";

const ProtectedInstructorRoute = ({ instructor, isLoading, children }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  // If user is null (not authenticated), redirect to login
  if (!instructor) {
    return <Navigate to="/instructor/login" replace />;
  }

  // If user exists, render the protected content
  return children;
};

export default ProtectedInstructorRoute;
