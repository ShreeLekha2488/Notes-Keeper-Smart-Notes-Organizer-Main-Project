const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    // Owner
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Title
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },

    // Description
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },

    // Folder
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },

    // Tags
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // Card Color
    color: {
      type: String,
      default: "#ffffff",
    },

    // Favourite
    isFavorite: {
      type: Boolean,
      default: false,
    },

    // Pin
    isPinned: {
      type: Boolean,
      default: false,
    },

    // Archive
    isArchived: {
      type: Boolean,
      default: false,
    },

    // Trash
    isTrashed: {
      type: Boolean,
      default: false,
    },

    trashedAt: {
      type: Date,
      default: null,
    },

    // Last Edited
    lastEdited: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", noteSchema);