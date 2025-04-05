import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token exists, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Decode the token to check the user type
  const decodedToken = JSON.parse(atob(token.split(".")[1]));

  if (decodedToken.typeUtilisateur !== "admin") {
    // If the user is not an admin, redirect to homepage or another page
    return <Navigate to="/" replace />;
  }

  // If the user is authenticated and an admin, render the children (protected component)
  return children;
};

export default PrivateRoute;
