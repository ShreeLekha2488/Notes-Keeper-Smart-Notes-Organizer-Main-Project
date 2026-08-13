import API from "./api";

/* ==========================================
   Notes Services
========================================== */

// Get All Notes
export const getAllNotes = async (params = {}) => {
  const response = await API.get("/notes", {
    params,
  });

  return response.data;
};


// Get Single Note
export const getNote = async (id) => {
  const response = await API.get(`/notes/${id}`);

  return response.data;
};


// Create Note
export const createNote = async (noteData) => {
  const response = await API.post("/notes", {
    title: noteData.title,
    content: noteData.content,
    folder: noteData.folder || null,
    favorite: noteData.favorite || false,
    pinned: noteData.pinned || false,
    archived: noteData.archived || false,
    tags: noteData.tags || [],
    color: noteData.color || "#ffffff",
  });

  return response.data;
};


// Update Note
export const updateNote = async (id, noteData) => {
  const response = await API.put(`/notes/${id}`, {
    title: noteData.title,
    content: noteData.content,
    folder: noteData.folder || null,
    favorite: noteData.favorite || false,
    pinned: noteData.pinned || false,
    archived: noteData.archived || false,
    tags: noteData.tags || [],
    color: noteData.color || "#ffffff",
  });

  return response.data;
};


// Delete Note (Move to Trash)
export const deleteNote = async (id) => {
  const response = await API.delete(`/notes/${id}`);

  return response.data;
};


/* ==========================================
   Actions
========================================== */

// Favourite
export const toggleFavorite = async (id) => {
  const response = await API.patch(
    `/notes/${id}/favorite`
  );

  return response.data;
};


// Pin
export const togglePin = async (id) => {
  const response = await API.patch(
    `/notes/${id}/pin`
  );

  return response.data;
};


// Archive
export const toggleArchive = async (id) => {
  const response = await API.patch(
    `/notes/${id}/archive`
  );

  return response.data;
};


// Trash
export const moveToTrash = async (id) => {
  const response = await API.patch(
    `/notes/${id}/trash`
  );

  return response.data;
};


// Restore
export const restoreNote = async (id) => {
  const response = await API.patch(
    `/notes/${id}/restore`
  );

  return response.data;
};


// Permanent Delete
export const deleteForever = async (id) => {
  const response = await API.delete(
    `/notes/${id}/permanent`
  );

  return response.data;
};


/* ==========================================
   Search Notes
========================================== */

export const searchNotes = async (keyword) => {
  const response = await API.get("/notes/search", {
    params: {
      keyword,
    },
  });

  return response.data;
};


/* ==========================================
   Folder Notes
========================================== */

export const getNotesByFolder = async (folderId) => {
  const response = await API.get(
    `/folders/${folderId}/notes`
  );

  return response.data;
};


/* ==========================================
   Favourite Notes
========================================== */

export const getFavouriteNotes = async () => {
  const response = await API.get(
    "/notes/favorites"
  );

  return response.data;
};


/* ==========================================
   Pinned Notes
========================================== */

export const getPinnedNotes = async () => {
  const response = await API.get(
    "/notes/pinned"
  );

  return response.data;
};


/* ==========================================
   Archived Notes
========================================== */

export const getArchivedNotes = async () => {
  const response = await API.get(
    "/notes/archived"
  );

  return response.data;
};


/* ==========================================
   Trash Notes
========================================== */

export const getTrashNotes = async () => {
  const response = await API.get(
    "/notes/trash"
  );

  return response.data;
};

/* ==========================================
   Note Version History
========================================== */

export const getNoteVersions = async (id) => {
  const response = await API.get(
    `/notes/${id}/versions`
  );

  return response.data;
};