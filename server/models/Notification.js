const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // User who owns this notification
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Notification title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Notification message
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Notification type
    type: {
      type: String,
      enum: [
        "note_created",
        "note_updated",
        "favorite",
        "pin",
        "archive",
        "trash",
        "restore",
        "folder_created",
        "folder_deleted",
        "tag_created",
        "task_reminder",
        "general",
      ],
      default: "general",
    },

    // Optional related note
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      default: null,
    },

    // Optional related folder
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },

    // Whether user has read the notification
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Helps quickly retrieve a user's unread notifications
notificationSchema.index({
  user: 1,
  read: 1,
  createdAt: -1,
});

// Helps retrieve all notifications for a user
notificationSchema.index({
  user: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);