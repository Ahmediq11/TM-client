// src/components/TaskForm.js
import React, { useState } from "react";

const MAX_TASK_LENGTH = 100; // Reasonable limit for task title

const TaskForm = ({ onAddTask }) => {
  const [task, setTask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTask = task.trim();

    if (!trimmedTask) {
      setError("Task cannot be empty");
      return;
    }

    if (trimmedTask.length > MAX_TASK_LENGTH) {
      setError(`Task must be less than ${MAX_TASK_LENGTH} characters`);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await onAddTask(trimmedTask);
      setTask("");
    } catch (error) {
      setError(error.message || "Failed to add task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setTask(e.target.value);
    if (error) setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {error && (
        <div
          className="alert alert-danger py-2 px-3 mb-3"
          style={{
            fontSize: "0.9rem",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          backgroundColor: "var(--background-color)",
          padding: "0.5rem",
          borderRadius: "12px",
          border: `2px solid ${
            error ? "var(--danger-color)" : "var(--primary-color)"
          }`,
          borderOpacity: "0.1",
          transition: "all 0.2s ease",
        }}
      >
        <input
          type="text"
          value={task}
          onChange={handleChange}
          maxLength={MAX_TASK_LENGTH}
          required
          placeholder="✍️ Add a new task..."
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "var(--card-background)",
            color: "var(--text-primary)",
            fontSize: "0.95rem",
            transition: "all 0.2s ease",
            outline: "none",
          }}
          onFocus={(e) => {
            e.target.style.boxShadow = "0 0 0 2px var(--primary-color)";
            e.target.style.backgroundColor = "var(--card-background)";
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = "none";
            e.target.style.backgroundColor = "var(--card-background)";
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "var(--primary-color)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "0.75rem 1.5rem",
            fontWeight: "600",
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "var(--primary-hover)";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "var(--primary-color)";
            e.target.style.transform = "translateY(0)";
          }}
        >
          {isSubmitting ? (
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <>
              <span>Add Task</span>
              <span style={{ fontSize: "1.1rem" }}>+</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
