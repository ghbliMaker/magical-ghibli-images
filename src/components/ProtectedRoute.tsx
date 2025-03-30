
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login page and save the intended destination
      navigate("/login", { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  // If user is authenticated, render the children
  return user ? <>{children}</> : null;
};
