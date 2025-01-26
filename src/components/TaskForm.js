// src/components/TaskForm.js
import React, { useState } from "react";

const TaskForm = ({ onAddTask }) => {
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      onAddTask(task);
      setTask("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          backgroundColor: "var(--background-color)",
          padding: "0.5rem",
          borderRadius: "12px",
          border: "2px solid var(--primary-color)",
          borderOpacity: "0.1",
        }}
      >
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
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
          <span>Add Task</span>
          <span style={{ fontSize: "1.1rem" }}>+</span>
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
