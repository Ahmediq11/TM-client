// src/components/TaskList.js
import React from "react";

const TaskList = ({ tasks, onComplete, onDelete, type = "active" }) => {
  const filteredTasks = tasks.filter((task) =>
    type === "active" ? !task.completed : task.completed
  );

  return (
    <div className="task-section">
      <h2 className="task-section-title">
        {type === "active" ? "Active Tasks" : "Completed Tasks"}
      </h2>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>
            {type === "active"
              ? "No active tasks. Add a new task to get started!"
              : "No completed tasks yet. Complete some tasks to see them here!"}
          </p>
        </div>
      ) : (
        <div className="task-grid">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`task-card ${task.completed ? "completed" : ""}`}
            >
              <div className="task-card-content">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onComplete(task._id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <span className="task-title">{task.title}</span>
              </div>
              <button
                onClick={() => onDelete(task._id)}
                className="delete-btn"
                aria-label="Delete task"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
