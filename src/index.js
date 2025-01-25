// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/modern-styles.css";
import "./styles/style.css";
import "./styles/styles.css";

// Set API base URL for production/development
window.API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-server-url.vercel.app/"
    : "http://localhost:3000/api";
REACT_APP_API_URL;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
