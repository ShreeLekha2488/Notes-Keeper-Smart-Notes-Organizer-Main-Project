const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    // Folder Name
    name: {
      type: String,
      required: [true, "Folder name is required"],
      trim: true,
      maxlength: 50,
    },

    // Folder Color
    color: {
      type: String,
      default: "#3B82F6",
    },

    // Folder Icon
    icon: {
      type: String,
      default: "📁",
    },

    // Folder Description
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Owner
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate folder names for the same user
folderSchema.index(
  { user: 1, name: 1 },
  { unique: true }
);

module.exports = mongoose.model("Folder", folderSchema);