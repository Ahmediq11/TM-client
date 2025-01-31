// src/components/Dashboard.js
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks, addTask, updateTask, deleteTask } from "../api/api";
import TaskForm from "./TaskForm.js";
import TaskList from "./TaskList.js";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const loadTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const tasksData = await getTasks(token);
      setTasks(tasksData);
      setError(null);
    } catch (error) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddTask = async (title) => {
    const tempId = Date.now().toString();
    const optimisticTask = {
      _id: tempId,
      title,
      completed: false,
      created_at: new Date().toISOString(),
    };

    try {
      // Add optimistic task
      setTasks((currentTasks) => [optimisticTask, ...currentTasks]);

      // Make API call
      const token = localStorage.getItem("token");
      await addTask(title, token);

      // Refresh tasks to get actual server data
      await loadTasks();
    } catch (error) {
      // Remove optimistic task on error
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== tempId)
      );
      throw error;
    }
  };

  const handleCompleteTask = useCallback(
    async (taskId) => {
      const token = localStorage.getItem("token");
      const task = tasks.find((t) => t._id === taskId);
      if (!task) return;

      const newCompletedState = !task.completed;
      let updatePromise = null;

      try {
        // Optimistic update
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId ? { ...t, completed: newCompletedState } : t
          )
        );

        // Set loading state for this task
        setLoadingStates((prev) => ({ ...prev, [taskId]: true }));

        // Store the promise for the API call
        updatePromise = updateTask(taskId, newCompletedState, token);

        // Wait for the API call to complete
        await updatePromise;

        // Only reload tasks if this was the last update for this task
        if (updatePromise === updateTask(taskId, newCompletedState, token)) {
          await loadTasks();
        }
      } catch (error) {
        // Only revert if this was the last update attempt
        if (updatePromise === updateTask(taskId, newCompletedState, token)) {
          setTasks((prev) =>
            prev.map((t) =>
              t._id === taskId ? { ...t, completed: !newCompletedState } : t
            )
          );
          setError("Failed to update task. Please try again.");
          console.error("Error completing task:", error);
        }
      } finally {
        setLoadingStates((prev) => ({ ...prev, [taskId]: false }));
      }
    },
    [tasks, loadTasks]
  );

  // Debounced version of handleCompleteTask with proper cleanup
  const debouncedCompleteTask = useCallback(
    debounce((taskId) => {
      handleCompleteTask(taskId);
    }, 300),
    [handleCompleteTask]
  );

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");
    const taskToDelete = tasks.find((task) => task._id === taskId);

    try {
      // Optimistic delete
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== taskId)
      );

      // API call
      await deleteTask(taskId, token);
    } catch (error) {
      // Restore task on error
      setTasks((currentTasks) => [...currentTasks, taskToDelete]);
      throw error;
    }
  };

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest(".user-menu")) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            zIndex: 1000,
            maxWidth: "300px",
          }}
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
            aria-label="Close"
          />
        </div>
      )}
      <nav className="navbar">
        <div className="container-fluid">
          <span
            className="navbar-brand fade-in"
            style={{ color: "var(--primary-color)", fontWeight: "700" }}
          >
            ✨ Task Manager
          </span>

          {/* Desktop view */}
          <div className="d-flex align-items-center gap-3">
            <span
              className="navbar-text slide-in"
              style={{ color: "var(--text-primary)" }}
            >
              Welcome back,{" "}
              <span
                style={{ color: "var(--primary-color)", fontWeight: "600" }}
              >
                {user?.username}
              </span>
            </span>
            <button
              onClick={logout}
              className="btn slide-in"
              style={{
                backgroundColor: "var(--background-color)",
                color: "var(--primary-color)",
                border: "2px solid var(--primary-color)",
                padding: "0.5rem 1.5rem",
                fontWeight: "600",
                borderRadius: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "var(--primary-color)";
                e.target.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "var(--background-color)";
                e.target.style.color = "var(--primary-color)";
              }}
            >
              Logout
            </button>
          </div>

          {/* Mobile view */}

          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          />
          <div className="user-menu">
            <button
              className="user-menu-icon"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-label="User menu"
            >
              <i className="fas fa-circle-user"></i>
            </button>
            <div
              className={`user-menu-dropdown ${isUserMenuOpen ? "active" : ""}`}
            >
              <span
                className="navbar-text"
                style={{ color: "var(--text-primary)" }}
              >
                Welcome back,{" "}
                <span
                  style={{ color: "var(--primary-color)", fontWeight: "600" }}
                >
                  {user?.username}
                </span>
              </span>
              <button onClick={logout} className="btn btn-primary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container my-5">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div
              className="card fade-in"
              style={{
                border: "none",
                borderRadius: "16px",
                width: "125%",
                marginTop: "15rem",
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4
                      className="mb-1"
                      style={{
                        color: "var(--text-primary)",
                        fontWeight: "700",
                      }}
                    >
                      My Tasks
                    </h4>
                    <p
                      className="mb-0"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Manage your daily tasks efficiently
                    </p>
                  </div>
                  <div className="d-flex align-items-center">
                    <span
                      className="badge"
                      style={{
                        backgroundColor: "#2125290a",
                        // opacity: "0.1",
                        color: "#6366f1",
                        fontWeight: "600",
                        padding: "0.5rem 1rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      {tasks.filter((t) => !t.completed).length} Active /{" "}
                      {tasks.length} Total
                    </span>
                  </div>
                </div>

                <TaskForm onAddTask={handleAddTask} />

                <div className="mt-4">
                  <TaskList
                    tasks={tasks}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteTask}
                    type="active"
                  />
                  <TaskList
                    tasks={tasks}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteTask}
                    type="completed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
