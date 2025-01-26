// src/components/TaskList.js
import React from "react";

const TaskList = ({ tasks, onComplete, onDelete, type = "active" }) => {
  const filteredTasks = tasks.filter((task) =>
    type === "active" ? !task.completed : task.completed
  );

  return (
    <div className="task-section mb-4">
      <h6 className="mb-3 text-secondary">
        {type === "active" ? "Active Tasks" : "Completed Tasks"}
      </h6>
      <ul className="list-group">
        {filteredTasks.map((task) => (
          <li
            key={task._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={task.completed}
                onChange={() => onComplete(task._id)}
              />
              <span className={task.completed ? "completed" : ""}>
                {task.title}
              </span>
            </div>
            <button
              onClick={() => onDelete(task._id)}
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
