const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const cloudinary = require("../config/cloudinary");

/* ==========================================================
   REGISTER USER
   POST /api/auth/register
========================================================== */

const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================================
   LOGIN USER
   POST /api/auth/login
========================================================== */

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================================
   GET PROFILE
   GET /api/auth/profile
========================================================== */

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================================
   UPDATE PROFILE
   PUT /api/auth/profile
========================================================== */

const updateUserProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /* ==========================================
       UPDATE NAME
    ========================================== */

    if (name && name.trim()) {
      user.name = name.trim();
    }

    /* ==========================================
       UPLOAD PROFILE IMAGE TO CLOUDINARY
    ========================================== */

    if (req.file) {
      const uploadResult = await new Promise(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "notes-keeper/profile-images",
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          stream.end(req.file.buffer);
        }
      );

      user.profileImage = uploadResult.secure_url;
    }

    await user.save();

    /* ==========================================
       RETURN UPDATED USER
    ========================================== */

    const updatedUser = await User.findById(
      user._id
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error(
      "Update Profile Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};

/* ==========================================================
   GET SETTINGS
   GET /api/auth/settings
========================================================== */

const getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("settings");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      settings: user.settings,
    });
  } catch (error) {
    console.error("Get Settings Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load settings",
    });
  }
};


/* ==========================================================
   UPDATE SETTINGS
   PUT /api/auth/settings
========================================================== */

const updateUserSettings = async (req, res) => {
  try {
    const {
      darkMode,
      emailNotifications,
      autoSave,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /* ==========================================
       UPDATE ONLY BOOLEAN VALUES THAT WERE SENT
    ========================================== */

    if (typeof darkMode === "boolean") {
      user.settings.darkMode = darkMode;
    }

    if (typeof emailNotifications === "boolean") {
      user.settings.emailNotifications =
        emailNotifications;
    }

    if (typeof autoSave === "boolean") {
      user.settings.autoSave = autoSave;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Settings saved successfully",
      settings: user.settings,
    });
  } catch (error) {
    console.error("Update Settings Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to save settings",
    });
  }
};

/* ==========================================================
   CHANGE PASSWORD
   PUT /api/auth/change-password
========================================================== */

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================================
   UPDATE SETTINGS
   PUT /api/auth/settings
========================================================== */

const updateSettings = async (req, res) => {
  try {
    const {
      darkMode,
      emailNotifications,
      taskReminders,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.preferences = {
      darkMode:
        typeof darkMode === "boolean"
          ? darkMode
          : user.preferences?.darkMode ?? false,

      emailNotifications:
        typeof emailNotifications === "boolean"
          ? emailNotifications
          : user.preferences?.emailNotifications ?? true,

      taskReminders:
        typeof taskReminders === "boolean"
          ? taskReminders
          : user.preferences?.taskReminders ?? true,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Settings saved successfully",
      preferences: user.preferences,
    });
  } catch (error) {
    console.error("Update Settings Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to save settings",
    });
  }
};


/* ==========================================================
   DELETE ACCOUNT
   DELETE /api/auth/account
========================================================== */

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete Account Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete account",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  updateSettings,
  deleteAccount,
};