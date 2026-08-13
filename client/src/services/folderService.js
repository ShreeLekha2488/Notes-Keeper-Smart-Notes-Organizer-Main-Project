import API from "./api";

// ================================
// GET ALL FOLDERS
// ================================

export const getFolders = async () => {
  const res = await API.get("/folders");
  return res.data;
};

// ================================
// GET SINGLE FOLDER
// ================================

export const getFolder = async (id) => {
  const res = await API.get(`/folders/${id}`);
  return res.data;
};

// ================================
// CREATE FOLDER
// ================================

export const createFolder = async (folderData) => {
  const res = await API.post("/folders", folderData);
  return res.data;
};

// ================================
// UPDATE FOLDER
// ================================

export const updateFolder = async (id, folderData) => {
  const res = await API.put(`/folders/${id}`, folderData);
  return res.data;
};

// ================================
// DELETE FOLDER
// ================================

export const deleteFolder = async (id) => {
  const res = await API.delete(`/folders/${id}`);
  return res.data;
};

// ================================
// GET NOTES INSIDE FOLDER
// ================================

export const getFolderNotes = async (id) => {
  const res = await API.get(`/folders/${id}/notes`);
  return res.data;
};