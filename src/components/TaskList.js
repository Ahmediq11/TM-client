// src/components/TaskList.js
import React from "react";

const TaskList = ({ tasks, onComplete, onDelete, type = "active" }) => {
  const filteredTasks = tasks.filter((task) =>
    type === "active" ? !task.completed : task.completed
  );

  if (filteredTasks.length === 0) {
    return (
      <div className="task-section mb-4">
        <h6
          className="mb-3"
          style={{
            color: "var(--text-secondary)",
            fontWeight: "600",
            fontSize: "0.875rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {type === "active" ? "Active Tasks" : "Completed Tasks"}
        </h6>
        <div
          className="text-center py-4"
          style={{
            color: "var(--text-secondary)",
            backgroundColor: "var(--background-color)",
            borderRadius: "12px",
            border: "2px dashed var(--text-secondary)",
            opacity: "0.5",
          }}
        >
          {type === "active"
            ? "No active tasks. Add a new task to get started!"
            : "No completed tasks yet. Complete some tasks to see them here!"}
        </div>
      </div>
    );
  }

  return (
    <div className="task-section mb-4">
      <h6
        className="mb-3"
        style={{
          color: "var(--text-secondary)",
          fontWeight: "600",
          fontSize: "0.875rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {type === "active" ? "Active Tasks" : "Completed Tasks"}
      </h6>
      <ul className="list-group">
        {filteredTasks.map((task) => (
          <li
            key={task._id}
            className="list-group-item task-item"
            style={{
              backgroundColor: "var(--card-background)",
              border: "1px solid var(--primary-color)",
              borderRadius: "12px",
              marginBottom: "0.75rem",
              padding: "1rem",
              transition: "all 0.2s ease",
              opacity: task.completed ? 0.7 : 1,
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center" style={{ flex: 1 }}>
                <div
                  style={{
                    position: "relative",
                    width: "24px",
                    height: "24px",
                    marginRight: "1rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onComplete(task._id)}
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      opacity: 0,
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      border: `2px solid ${
                        task.completed
                          ? "var(--primary-color)"
                          : "var(--text-secondary)"
                      }`,
                      borderRadius: "6px",
                      backgroundColor: task.completed
                        ? "var(--primary-color)"
                        : "transparent",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {task.completed && (
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: "white",
                          fontSize: "14px",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                </div>
                <span
                  style={{
                    color: "var(--text-primary)",
                    textDecoration: task.completed ? "line-through" : "none",
                    transition: "all 0.2s ease",
                    flex: 1,
                    wordBreak: "break-word",
                  }}
                >
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => onDelete(task._id)}
                className="btn"
                style={{
                  backgroundColor: "transparent",
                  color: "var(--danger-color)",
                  border: "none",
                  padding: "0.5rem",
                  marginLeft: "1rem",
                  opacity: 0.7,
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.opacity = "1";
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = "0.7";
                }}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
