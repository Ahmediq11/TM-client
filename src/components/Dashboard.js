// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks, addTask, updateTask, deleteTask } from "../api/api";
import TaskForm from "./TaskForm.js";
import TaskList from "./TaskList.js";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);

  const handleAddTask = async (title) => {
    try {
      const token = localStorage.getItem("token");
      const result = await addTask(title, token);
      const tasksData = await getTasks(token); // Refresh tasks from server
      setTasks(tasksData);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const task = tasks.find((t) => t._id === taskId);
      await updateTask(taskId, !task.completed, token);
      const tasksData = await getTasks(token); // Refresh tasks from server
      setTasks(tasksData);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await deleteTask(taskId, token);
      const tasksData = await getTasks(token); // Refresh tasks from server
      setTasks(tasksData);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasksData = await getTasks(localStorage.getItem("token"));
        setTasks(tasksData);
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };
    loadTasks();
  }, []);

  return (
    <>
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
