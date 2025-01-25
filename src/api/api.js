// src/api/api.js
const API_BASE_URL = window.location.origin + "/api";

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

export const getTasks = async (token) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
};
