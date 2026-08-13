import API from "./api";

/*
==========================================
Dashboard Services
==========================================
*/

// ==========================================
// Dashboard Statistics
// GET /api/notes/dashboard/stats
// ==========================================

export const getDashboardStats = async () => {
  const response = await API.get("/notes/dashboard/stats");
  return response.data;
};

// ==========================================
// Recent Notes
// GET /api/notes/recent
// ==========================================

export const getRecentNotes = async () => {
  const response = await API.get("/notes/recent");
  return response.data;
};

// ==========================================
// Favorite Notes
// GET /api/notes/favorites
// ==========================================

export const getFavoriteNotes = async () => {
  const response = await API.get("/notes/favorites");
  return response.data;
};

// ==========================================
// Recent Folders
// GET /api/folders
// ==========================================

export const getFolders = async () => {
  const response = await API.get("/folders");
  return response.data;
};