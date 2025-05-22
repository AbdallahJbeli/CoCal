import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedUserType }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    if (decoded.typeUtilisateur !== allowedUserType) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};


export const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedUserType="admin">{children}</ProtectedRoute>
);

export const ChauffeurRoute = ({ children }) => (
  <ProtectedRoute allowedUserType="chauffeur">{children}</ProtectedRoute>
);

export const ClientRoute = ({ children }) => (
  <ProtectedRoute allowedUserType="client">{children}</ProtectedRoute>
);

export const CommercialRoute = ({ children }) => (
  <ProtectedRoute allowedUserType="commercial">{children}</ProtectedRoute>
);

export default ProtectedRoute; 