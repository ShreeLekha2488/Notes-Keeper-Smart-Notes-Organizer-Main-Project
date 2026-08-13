const Notification = require("../models/Notification");

/* ==========================================================
   GET ALL NOTIFICATIONS
   GET /api/notifications
========================================================== */

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    })
      .populate("note", "title")
      .populate("folder", "name")
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load notifications",
    });
  }
};


/* ==========================================================
   GET UNREAD COUNT
   GET /api/notifications/unread-count
========================================================== */

const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error("Get Unread Count Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to get unread notification count",
    });
  }
};


/* ==========================================================
   CREATE NOTIFICATION
   POST /api/notifications
========================================================== */

const createNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      note,
      folder,
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    const notification = await Notification.create({
      user: req.user._id,
      title,
      message,
      type: type || "general",
      note: note || null,
      folder: folder || null,
      read: false,
    });

    res.status(201).json({
      success: true,
      message: "Notification created",
      notification,
    });
  } catch (error) {
    console.error("Create Notification Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create notification",
    });
  }
};


/* ==========================================================
   MARK ONE NOTIFICATION AS READ
   PATCH /api/notifications/:id/read
========================================================== */

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.read = true;

    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Mark Notification Read Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update notification",
    });
  }
};


/* ==========================================================
   MARK ALL NOTIFICATIONS AS READ
   PATCH /api/notifications/read-all
========================================================== */

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user._id,
        read: false,
      },
      {
        $set: {
          read: true,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark All Notifications Read Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to mark all notifications as read",
    });
  }
};


/* ==========================================================
   DELETE ONE NOTIFICATION
   DELETE /api/notifications/:id
========================================================== */

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Delete Notification Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete notification",
    });
  }
};


/* ==========================================================
   CLEAR ALL NOTIFICATIONS
   DELETE /api/notifications
========================================================== */

const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "All notifications cleared",
    });
  } catch (error) {
    console.error("Clear Notifications Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to clear notifications",
    });
  }
};


/* ==========================================================
   EXPORTS
========================================================== */

module.exports = {
  getNotifications,
  getUnreadCount,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
};