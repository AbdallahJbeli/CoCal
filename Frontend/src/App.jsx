import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./components/login";
import Adminpage from "./pages/Adminpage";
import AdminRoute from "../routes/AdminRoute";
import ClientRoute from "../routes/ClientRoute";
import ClientPage from "./pages/Clientpage";

const App = () => {
  return (
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

      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;
