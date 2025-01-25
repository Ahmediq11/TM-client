// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks } from "../api/api";
import TaskForm from "./TaskForm.js";
import TaskList from "./TaskList.js";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (title) => {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
  };

  const handleCompleteTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
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
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <span className="navbar-brand fade-in">Task Manager</span>
          <div className="d-flex align-items-center">
            <span className="navbar-text me-3 slide-in">
              Welcome, <span className="fw-bold">{user?.username}</span>
            </span>
            <button onClick={logout} className="btn btn-outline-light slide-in">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="card fade-in">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 color">My Tasks</h5>
                <span className="badge bg-primary">{tasks.length}/10</span>
              </div>
              <div className="card-body">
                <TaskForm onAddTask={handleAddTask} />
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
    </>
  );
};

export default Dashboard;
