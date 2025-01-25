// src/components/Welcome.js
import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => (
  <div className="container">
    <div className="welcome-box">
      <h1>Welcome to Our Website</h1>
      <div className="button-group">
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
        <Link to="/register" className="btn btn-success">
          Register
        </Link>
      </div>
    </div>
  </div>
);

export default Welcome;
