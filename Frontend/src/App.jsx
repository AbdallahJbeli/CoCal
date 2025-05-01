import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // <-- import Toaster
import Homepage from "./pages/Homepage";
import Login from "./components/login";
import Adminpage from "./pages/Adminpage";
import AdminRoute from "../routes/AdminRoute";
import ClientRoute from "../routes/ClientRoute";
import ClientPage from "./pages/ClientPage";
import CommercialRoute from "../routes/CommercialRoute";
import CommercialPage from "./pages/CommercialPage";

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
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
