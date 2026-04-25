import API from "./axios";

export const getTasks = (projectId) =>
  API.get(`/tasks/${projectId}`);

export const addTask = (projectId, title, description, priority) =>
  API.post(`/tasks/${projectId}`, { title, description, priority });

export const updateTask = (projectId, taskId, title, description) =>
  API.put(`/tasks/${projectId}/${taskId}`, { title, description });

export const deleteTask = (projectId, taskId) =>
  API.delete(`/tasks/${projectId}/${taskId}`);

export const updateTaskStatus = (projectId, taskId, status) =>
  API.patch(`/tasks/${projectId}/${taskId}/status`, { status });

export const assignTask = (projectId, taskId, assigneeId) =>
  API.patch(`/tasks/${projectId}/${taskId}/assign`, { assigneeId });

export const unassignTask = (projectId, taskId) =>
  API.patch(`/tasks/${projectId}/${taskId}/unassign`);
