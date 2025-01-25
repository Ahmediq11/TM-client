// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import "./styles/modern-styles.css";
import "./styles/style.css";
import "./styles/styles.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
