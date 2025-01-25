// src/components/ErrorBoundary.js
import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5">
          <div className="alert alert-danger">
            Something went wrong. Please refresh the page.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
