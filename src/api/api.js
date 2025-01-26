// src/api/api.js
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://tm-server-kappa.vercel.app/api"
    : "http://localhost:5000/api");

export const loginUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json();
};

export const registerUser = async (username, email, password) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) throw new Error("Registration failed");
  return response.json();
};

// Cache for tasks with a 30-second expiry
let tasksCache = {
  data: null,
  timestamp: null,
  expiryTime: 30000, // 30 seconds
};

const defaultHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

const handleResponse = async (response, errorMessage) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || errorMessage);
  }
  return response.json();
};

export const getTasks = async (token) => {
  // Check cache validity
  const now = Date.now();
  if (
    tasksCache.data &&
    tasksCache.timestamp &&
    now - tasksCache.timestamp < tasksCache.expiryTime
  ) {
    try {
      // Validate cached data structure
      if (!Array.isArray(tasksCache.data)) {
        throw new Error("Invalid cache data structure");
      }
      return tasksCache.data;
    } catch (error) {
      // If cache is invalid, clear it and proceed with fetch
      console.warn("Cache validation failed:", error);
      tasksCache.data = null;
      tasksCache.timestamp = null;
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: defaultHeaders(token),
      cache: "no-cache", // Ensure fresh data
    });

    const data = await handleResponse(response, "Failed to fetch tasks");

    // Validate response data before caching
    if (!Array.isArray(data)) {
      throw new Error("Invalid response data structure");
    }

    // Update cache only if data is valid
    tasksCache = {
      data,
      timestamp: now,
      expiryTime: tasksCache.expiryTime,
    };

    return data;
  } catch (error) {
    // Invalidate cache on error
    tasksCache.data = null;
    tasksCache.timestamp = null;
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const addTask = async (title, token) => {
  if (!title || typeof title !== "string" || !title.trim()) {
    throw new Error("Invalid task title");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: defaultHeaders(token),
      body: JSON.stringify({ title: title.trim() }),
    });

    const data = await handleResponse(response, "Failed to add task");

    // Completely invalidate cache
    tasksCache.data = null;
    tasksCache.timestamp = null;

    return data;
  } catch (error) {
    // Ensure cache is invalidated on error
    tasksCache.data = null;
    tasksCache.timestamp = null;
    console.error("Error adding task:", error);
    throw error;
  }
};

export const updateTask = async (taskId, completed, token) => {
  if (!taskId || typeof completed !== "boolean") {
    throw new Error("Invalid update parameters");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "PATCH",
      headers: defaultHeaders(token),
      body: JSON.stringify({ completed }),
    });

    const data = await handleResponse(response, "Failed to update task");

    // Completely invalidate cache
    tasksCache.data = null;
    tasksCache.timestamp = null;

    return data;
  } catch (error) {
    // Ensure cache is invalidated on error
    tasksCache.data = null;
    tasksCache.timestamp = null;
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (taskId, token) => {
  if (!taskId) {
    throw new Error("Invalid task ID");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: defaultHeaders(token),
    });

    const data = await handleResponse(response, "Failed to delete task");

    // Completely invalidate cache
    tasksCache.data = null;
    tasksCache.timestamp = null;

    return data;
  } catch (error) {
    // Ensure cache is invalidated on error
    tasksCache.data = null;
    tasksCache.timestamp = null;
    console.error("Error deleting task:", error);
    throw error;
  }
};
