import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./components/login";
import Adminpage from "./pages/Adminpage";
import PrivateRoute from "../routes/PrivateRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route
        path="/admin-space"
        element={
          <PrivateRoute>
            <Adminpage />
          </PrivateRoute>
        }
      />

      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;
