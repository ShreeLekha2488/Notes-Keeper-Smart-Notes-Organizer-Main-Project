const express = require("express");

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  updateSettings,
  deleteAccount,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

/* ==========================================
   AUTH
========================================== */

router.post("/register", registerUser);
router.post("/login", loginUser);

/* ==========================================
   USER PROFILE
========================================== */

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, upload.single("profileImage"), updateUserProfile);

router.delete("/account", protect, deleteAccount);

router.put("/settings", protect, updateSettings);

router.put("/change-password", protect, changePassword);

module.exports = router;