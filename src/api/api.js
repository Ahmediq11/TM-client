// src/api/api.js
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://tm-server-kappa.vercel.app/api"
    : "http://localhost:5000/api";

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
    return tasksCache.data;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: defaultHeaders(token),
      cache: "no-cache", // Ensure fresh data
    });

    const data = await handleResponse(response, "Failed to fetch tasks");

    // Update cache
    tasksCache = {
      data,
      timestamp: now,
      expiryTime: tasksCache.expiryTime,
    };

    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const addTask = async (title, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: defaultHeaders(token),
      body: JSON.stringify({ title }),
    });

    const data = await handleResponse(response, "Failed to add task");

    // Invalidate cache
    tasksCache.timestamp = null;

    return data;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

export const updateTask = async (taskId, completed, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "PATCH",
      headers: defaultHeaders(token),
      body: JSON.stringify({ completed }),
    });

    const data = await handleResponse(response, "Failed to update task");

    // Invalidate cache
    tasksCache.timestamp = null;

    return data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (taskId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: defaultHeaders(token),
    });

    const data = await handleResponse(response, "Failed to delete task");

    // Invalidate cache
    tasksCache.timestamp = null;

    return data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
