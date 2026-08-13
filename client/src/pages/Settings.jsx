import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiSettings,
  FiMoon,
  FiMail,
  FiBell,
  FiShield,
  FiTrash2,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";

import {
  getProfile,
  updateSettings,
  deleteAccount,
} from "../services/authService";

import "./Settings.css";

const Settings = () => {
  const { user, logout } = useAuth();

  const [settings, setSettings] = useState({
    darkMode: false,
    emailNotifications: true,
    taskReminders: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await getProfile();

      if (res.success && res.user?.preferences) {
        setSettings({
          darkMode:
            res.user.preferences.darkMode ?? false,

          emailNotifications:
            res.user.preferences.emailNotifications ?? true,

          taskReminders:
            res.user.preferences.taskReminders ?? true,
        });
      } else {
        const savedTheme =
          localStorage.getItem("theme") === "dark";

        setSettings((prev) => ({
          ...prev,
          darkMode: savedTheme,
        }));
      }
    } catch (error) {
      console.error("Load Settings Error:", error);

      toast.error("Unable to load settings");
    }
  };

  const handleToggle = async (key) => {
    const updatedSettings = {
      ...settings,
      [key]: !settings[key],
    };

    setSettings(updatedSettings);

    try {
      setLoading(true);

      const res = await updateSettings(updatedSettings);

      if (res.success) {
        toast.success("Setting updated");

        if (key === "darkMode") {
          if (updatedSettings.darkMode) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
          } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
          }
        }
      }
    } catch (error) {
      console.error("Update Settings Error:", error);

      setSettings(settings);

      toast.error(
        error.response?.data?.message ||
          "Unable to save setting"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await deleteAccount();

      if (res.success) {
        toast.success("Account deleted successfully");

        logout();
      }
    } catch (error) {
      console.error("Delete Account Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">

      {/* ================================
          SETTINGS HEADER
      ================================= */}

      <div className="settings-header">

        <div className="settings-main-icon">
          <FiSettings />
        </div>

        <div>
          <h1>Settings</h1>

          <p>
            Manage your Notes Keeper preferences
          </p>
        </div>

      </div>


      {/* ================================
          PREFERENCES
      ================================= */}

      <div className="settings-card">

        <div className="settings-section-header">

          <div className="section-icon">
            <FiSettings />
          </div>

          <div>
            <h2>Preferences</h2>

            <p>
              Customize how Notes Keeper works for you.
            </p>
          </div>

        </div>


        {/* DARK MODE */}

        <div className="setting-row">

          <div className="setting-icon">
            <FiMoon />
          </div>

          <div className="setting-content">

            <h3>Dark Mode</h3>

            <p>
              Use a dark theme throughout the application.
            </p>

          </div>

          <button
            type="button"
            className={`switch ${
              settings.darkMode ? "active" : ""
            }`}
            onClick={() =>
              handleToggle("darkMode")
            }
            disabled={loading}
          >
            <span></span>
          </button>

        </div>


        {/* EMAIL NOTIFICATIONS */}

        <div className="setting-row">

          <div className="setting-icon">
            <FiMail />
          </div>

          <div className="setting-content">

            <h3>Email Notifications</h3>

            <p>
              Receive important updates and notifications.
            </p>

          </div>

          <button
            type="button"
            className={`switch ${
              settings.emailNotifications
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleToggle("emailNotifications")
            }
            disabled={loading}
          >
            <span></span>
          </button>

        </div>


        {/* TASK REMINDERS */}

        <div className="setting-row">

          <div className="setting-icon">
            <FiBell />
          </div>

          <div className="setting-content">

            <h3>Task Reminders</h3>

            <p>
              Get reminders about your pending tasks.
            </p>

          </div>

          <button
            type="button"
            className={`switch ${
              settings.taskReminders
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleToggle("taskReminders")
            }
            disabled={loading}
          >
            <span></span>
          </button>

        </div>

      </div>


      {/* ================================
          ACCOUNT SECURITY
      ================================= */}

      <div className="settings-card security-card">

        <div className="settings-section-header">

          <div className="section-icon">
            <FiShield />
          </div>

          <div>
            <h2>Account Security</h2>

            <p>
              Manage your account and security settings.
            </p>
          </div>

        </div>


        {/* DELETE ACCOUNT */}

        <div className="delete-account-section">

          <div>

            <h3>Delete Account</h3>

            <p>
              Permanently delete your Notes Keeper
              account and associated data.
            </p>

          </div>

          <button
            type="button"
            className="delete-btn"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            <FiTrash2 />

            {loading
              ? "Deleting..."
              : "Delete My Account"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default Settings;