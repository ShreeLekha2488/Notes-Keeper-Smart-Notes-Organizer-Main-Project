const express = require("express");

const {
  createNote,
  getAllNotes,
  getSingleNote,
  updateNote,
  deleteNote,

  togglePinNote,
  toggleArchiveNote,
  toggleTrashNote,
  restoreNote,
  deleteForeverNote,

  searchNotes,
  getArchivedNotes,
  getTrashedNotes,

  getNotesByFolder,
  getNotesByTag,

  getDashboardStats,
  getRecentNotes,

  toggleFavoriteNote,
  getFavoriteNotes,
  getPinnedNotes,

  bulkArchiveNotes,
  bulkMoveToTrash,
  bulkRestoreNotes,
  bulkDeleteForever,
  emptyTrash,

  // Version History
  getNoteVersions,

} = require("../controllers/noteController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

/*
==========================================
            Note Routes
==========================================
*/

// Bulk Archive Notes
router.patch("/bulk/archive", protect, bulkArchiveNotes);

// Bulk Move Notes to Trash
router.patch("/bulk/trash", protect, bulkMoveToTrash);

// Bulk Restore Notes
router.patch("/bulk/restore", protect, bulkRestoreNotes);

// Bulk Delete Forever
router.delete("/bulk/permanent", protect, bulkDeleteForever);

// Create Note
router.post("/", protect, createNote);

// Get All Notes
router.get("/", protect, getAllNotes);

// Dashboard Stats
router.get("/dashboard/stats", protect, getDashboardStats);

// Recent Notes
router.get("/recent", protect, getRecentNotes);

// Favorite Notes
router.get("/favorites", protect, getFavoriteNotes);

// Pinned Notes
router.get("/pinned", protect, getPinnedNotes);

// Search Notes
router.get("/search", protect, searchNotes);

// Archived Notes
router.get("/archived", protect, getArchivedNotes);

// Trashed Notes
router.get("/trash", protect, getTrashedNotes);

// Empty Trash
router.delete("/trash/empty", protect, emptyTrash);

// Notes By Tag
router.get("/tag/:tagId", protect, getNotesByTag);

// Notes By Folder
router.get("/folder/:folderId", protect, getNotesByFolder);

// Note Version History
router.get("/:id/versions", protect, getNoteVersions);

// Get Single Note
router.get("/:id", protect, getSingleNote);

// Update Note
router.put("/:id", protect, updateNote);

// Delete Note
router.delete("/:id", protect, deleteNote);

// Toggle Pin Note
router.patch("/:id/pin", protect, togglePinNote);

// Toggle Archive Note
router.patch("/:id/archive", protect, toggleArchiveNote);

// Toggle Trash Note
router.patch("/:id/trash", protect, toggleTrashNote);

// Restore Note
router.patch("/:id/restore", protect, restoreNote);

// Toggle Favorite Note
router.patch("/:id/favorite", protect, toggleFavoriteNote);

// Delete Forever Note
router.delete("/:id/permanent", protect, deleteForeverNote);

module.exports = router;