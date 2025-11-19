import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">Verifying your access...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;

