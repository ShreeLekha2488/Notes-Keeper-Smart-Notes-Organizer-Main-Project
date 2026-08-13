const express = require("express");

const {
  createFolder,
  getAllFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
  getFolderNotes,
} = require("../controllers/folderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

/*
==========================================
Folder Routes
==========================================
*/

// Create Folder
router.post("/", protect, createFolder);

// Get All Folders
router.get("/", protect, getAllFolders);

// Get Notes Inside Folder
router.get("/:id/notes", protect, getFolderNotes);

// Get Single Folder
router.get("/:id", protect, getFolderById);

// Update Folder
router.put("/:id", protect, updateFolder);

// Delete Folder
router.delete("/:id", protect, deleteFolder);

module.exports = router;