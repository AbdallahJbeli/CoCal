import React from "react";
import { Navigate } from "react-router-dom";

const CommercialRoute = ({ children }) => {
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

    if (decoded.typeUtilisateur !== "chauffeur") {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default CommercialRoute;
