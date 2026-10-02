const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options) {
  const response = await fetch(API_URL + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export const getTasks = (search = "") =>
  request(`/tasks?search=${encodeURIComponent(search)}`);

export const createTask = (task) =>
  request("/tasks", { method: "POST", body: JSON.stringify(task) });

export const updateTask = (id, task) =>
  request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(task) });

export const deleteTask = (id) => request(`/tasks/${id}`, { method: "DELETE" });
