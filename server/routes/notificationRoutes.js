const express = require("express");

const {
  getNotifications,
  getUnreadCount,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* ==========================================================
   Notification Routes
========================================================== */


/* ==========================================================
   GET ALL NOTIFICATIONS
   GET /api/notifications
========================================================== */

router.get(
  "/",
  protect,
  getNotifications
);


/* ==========================================================
   GET UNREAD COUNT
   GET /api/notifications/unread-count
========================================================== */

router.get(
  "/unread-count",
  protect,
  getUnreadCount
);


/* ==========================================================
   CREATE NOTIFICATION
   POST /api/notifications
========================================================== */

router.post(
  "/",
  protect,
  createNotification
);


/* ==========================================================
   MARK ALL AS READ

   IMPORTANT:
   This route must come BEFORE /:id/read.
========================================================== */

router.patch(
  "/read-all",
  protect,
  markAllAsRead
);


/* ==========================================================
   MARK ONE AS READ
   PATCH /api/notifications/:id/read
========================================================== */

router.patch(
  "/:id/read",
  protect,
  markAsRead
);


/* ==========================================================
   DELETE ONE NOTIFICATION
   DELETE /api/notifications/:id
========================================================== */

router.delete(
  "/:id",
  protect,
  deleteNotification
);


/* ==========================================================
   CLEAR ALL NOTIFICATIONS
   DELETE /api/notifications
========================================================== */

router.delete(
  "/",
  protect,
  clearNotifications
);


module.exports = router;