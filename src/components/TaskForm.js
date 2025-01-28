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
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="task-input-container">
        <input
          type="text"
          value={task}
          onChange={handleChange}
          maxLength={MAX_TASK_LENGTH}
          required
          placeholder="✍️ Add a new task..."
          className="task-input"
        />
        <button
          type="submit"
          className="btn btn-primary add-task-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="spinner" />
          ) : (
            <>
              <span>Add Task</span>
              <span className="plus-icon">+</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
