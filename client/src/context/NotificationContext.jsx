import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import API from "../services/api";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // ==========================================================
  // LOAD NOTIFICATIONS FROM MONGODB
  // ==========================================================

  const loadNotifications = useCallback(async () => {
    try {
      const response = await API.get("/notifications");

      const data = response.data;

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error(
        "Load Notifications Error:",
        error
      );
    }
  }, []);

  // ==========================================================
  // LOAD ONCE WHEN USER LOGS IN / APP STARTS
  // ==========================================================

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // ==========================================================
  // CREATE NOTIFICATION
  // ==========================================================

  const addNotification = useCallback(
    async (
      title,
      message,
      type = "general",
      note = null,
      folder = null
    ) => {
      try {
        const response = await API.post(
          "/notifications",
          {
            title,
            message,
            type,
            note,
            folder,
          }
        );

        const notification =
          response.data.notification;

        if (notification) {
          setNotifications((prev) => [
            notification,
            ...prev,
          ]);
        }

        return notification;
      } catch (error) {
        console.error(
          "Create Notification Error:",
          error
        );

        throw error;
      }
    },
    []
  );

  // ==========================================================
  // MARK ONE AS READ
  // ==========================================================

  const markAsRead = async (id) => {
    try {
      await API.patch(
        `/notifications/${id}/read`
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                read: true,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Mark Notification Read Error:",
        error
      );
    }
  };

  // ==========================================================
  // MARK ALL AS READ
  // ==========================================================

  const markAllAsRead = async () => {
    try {
      await API.patch(
        "/notifications/read-all"
      );

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          read: true,
        }))
      );
    } catch (error) {
      console.error(
        "Mark All Notifications Error:",
        error
      );
    }
  };

  // ==========================================================
  // DELETE ONE NOTIFICATION
  // ==========================================================

  const deleteNotification = async (id) => {
    try {
      await API.delete(
        `/notifications/${id}`
      );

      setNotifications((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete Notification Error:",
        error
      );
    }
  };

  // ==========================================================
  // CLEAR ALL NOTIFICATIONS
  // ==========================================================

  const clearNotifications = async () => {
    try {
      await API.delete("/notifications");

      setNotifications([]);
    } catch (error) {
      console.error(
        "Clear Notifications Error:",
        error
      );
    }
  };

  // ==========================================================
  // UNREAD COUNT
  // ==========================================================

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearNotifications,
        loadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () =>
  useContext(NotificationContext);