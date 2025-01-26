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
    const token = localStorage.getItem("token");
    let tempId;

    try {
      // Optimistic update
      tempId = Date.now().toString();
      const optimisticTask = {
        _id: tempId,
        title,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [optimisticTask, ...prev]);

      // API call
      await addTask(title, token);
      await loadTasks(); // Refresh with actual data
    } catch (error) {
      // Revert optimistic update on error
      if (tempId) {
        setTasks((prev) => prev.filter((t) => t._id !== tempId));
      }
      setError("Failed to add task. Please try again.");
      console.error("Error adding task:", error);
    }
  };

  const handleCompleteTask = useCallback(
    async (taskId) => {
      try {
        const token = localStorage.getItem("token");
        const task = tasks.find((t) => t._id === taskId);

        // Optimistic update
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId ? { ...t, completed: !t.completed } : t
          )
        );

        // Set loading state for this task
        setLoadingStates((prev) => ({ ...prev, [taskId]: true }));

        // Debounced API call
        await updateTask(taskId, !task.completed, token);
        await loadTasks(); // Refresh with actual data
      } catch (error) {
        // Revert optimistic update on error
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId ? { ...t, completed: !t.completed } : t
          )
        );
        setError("Failed to update task. Please try again.");
        console.error("Error completing task:", error);
      } finally {
        setLoadingStates((prev) => ({ ...prev, [taskId]: false }));
      }
    },
    [tasks, loadTasks]
  );

  // Debounced version of handleCompleteTask
  const debouncedCompleteTask = useCallback(
    debounce((taskId) => handleCompleteTask(taskId), 300),
    [handleCompleteTask]
  );

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");

    // Store the task before deletion
    const taskToDelete = tasks.find((t) => t._id === taskId);
    if (!taskToDelete) {
      setError("Task not found");
      return;
    }

    try {
      // Optimistic update
      setTasks((prev) => prev.filter((t) => t._id !== taskId));

      // API call
      await deleteTask(taskId, token);
    } catch (error) {
      // Revert optimistic update on error
      setTasks((prev) => [...prev, taskToDelete]);
      setError("Failed to delete task. Please try again.");
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

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
        <div className="container">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center">
              <span
                className="navbar-brand fade-in"
                style={{ color: "var(--primary-color)", fontWeight: "700" }}
              >
                ✨ Task Manager
              </span>
            </div>
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
          </div>
        </div>
      </nav>

      <div className="container my-5">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div
              className="card fade-in"
              style={{ border: "none", borderRadius: "16px" }}
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
                        backgroundColor: "var(--primary-color)",
                        opacity: "0.1",
                        color: "var(--primary-color)",
                        fontWeight: "600",
                        padding: "0.5rem 1rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      {tasks.length}/10 Tasks
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
