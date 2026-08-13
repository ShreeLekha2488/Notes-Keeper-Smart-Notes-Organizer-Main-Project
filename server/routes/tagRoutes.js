const express = require("express");

const {
  getTags,
  createTag,
  updateTag,
  deleteTag,
} = require("../controllers/tagController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* Get all tags */
router.get("/", protect, getTags);

/* Create tag */
router.post("/", protect, createTag);

/* Update tag */
router.put("/:id", protect, updateTag);

/* Delete tag */
router.delete("/:id", protect, deleteTag);

module.exports = router;