// src/components/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/api";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await registerUser(formData.username, formData.email, formData.password);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Choose a username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Choose a password"
              />
              <div
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                tabIndex={0}
              >
                {showPassword ? (
                  <BsEyeSlashFill size={20} />
                ) : (
                  <BsEyeFill size={20} />
                )}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                id="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Confirm your password"
              />
              <div
                className="password-toggle-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                role="button"
                tabIndex={0}
              >
                {showConfirmPassword ? (
                  <BsEyeSlashFill size={20} />
                ) : (
                  <BsEyeFill size={20} />
                )}
              </div>
            </div>
            {formData.password &&
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <small className="text-danger">Passwords do not match</small>
              )}
          </div>
          <button
            type="submit"
            className="btn btn-success"
            disabled={formData.password !== formData.confirmPassword}
          >
            Register
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
