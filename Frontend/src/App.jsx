import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // <-- import Toaster
import Homepage from "./pages/Homepage";
import Login from "./components/Authentification/Login";
import Adminpage from "./pages/Adminpage";
import {
  AdminRoute,
  ClientRoute,
  CommercialRoute,
  ChauffeurRoute,
} from "../routes/ProtectedRoute";
import ClientPage from "./pages/ClientPage";
import CommercialPage from "./pages/CommercialPage";
import ChauffeurPage from "./pages/ChauffeurPage";
import ForgotPassword from "./components/Authentification/ForgotPassword";
import ResetPassword from "./components/Authentification/ResetPassword";

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/admin-space"
          element={
            <AdminRoute>
              <Adminpage />
            </AdminRoute>
          }
        />
        <Route
          path="/client-space"
          element={
            <ClientRoute>
              <ClientPage />
            </ClientRoute>
          }
        />
        <Route
          path="/commercial-space"
          element={
            <CommercialRoute>
              <CommercialPage />
            </CommercialRoute>
          }
        />
        <Route
          path="/chauffeur-space"
          element={
            <ChauffeurRoute>
              <ChauffeurPage />
            </ChauffeurRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </>
  );
};

export default App;
