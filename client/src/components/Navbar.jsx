import { useEffect, useRef, useState } from "react";
import {
  FiSearch,
  FiBell,
  FiSun,
  FiMoon,
  FiChevronDown,
  FiCheckCircle,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotifications();

  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const [navbarSearch, setNavbarSearch] =
    useState("");

  // ==========================================
  // SEARCH
  // ==========================================

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // ==========================================
  // DARK MODE
  // ==========================================

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // ==========================================
  // CLOSE DROPDOWNS
  // ==========================================

  useEffect(() => {
    const closeDropdown = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", closeDropdown);

    return () =>
      document.removeEventListener(
        "mousedown",
        closeDropdown
      );
  }, []);

  // ==========================================
  // SEARCH HANDLER
  // ==========================================

  const handleSearch = (e) => {
    e.preventDefault();

    const keyword = navbarSearch.trim();

    if (!keyword) {
      navigate("/search");
      return;
    }

    navigate(
      `/search?keyword=${encodeURIComponent(keyword)}`
    );
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2>Dashboard</h2>

        <span>{today}</span>
      </div>

      {/* SEARCH */}

      <form
        className="navbar-search"
        onSubmit={handleSearch}
      >
        <FiSearch />

        <input
          type="text"
          placeholder="Search notes, folders, tags..."
          value={navbarSearch}
          onChange={(e) =>
            setNavbarSearch(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const value = navbarSearch.trim();

              if (value) {
                navigate(
                  `/search?keyword=${encodeURIComponent(value)}`
                );
              } else {
                navigate("/search");
              }
            }
          }}
        />
      </form>

      <div className="navbar-right">

        {/* Theme */}

        <button
          className="icon-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        {/* Notification */}

        <div
          className="notification-wrapper"
          ref={notificationRef}
        >
          <button
            className="icon-btn"
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
          >
            <FiBell />

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">

              <div className="notification-header">
                <h4>Notifications</h4>

                <button
                  onClick={markAllAsRead}
                >
                  Mark All
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="notification-empty">
                  No Notifications
                </div>
              ) : (
                <>
                  {/* ==========================================
                      SCROLLABLE NOTIFICATION LIST
                  ========================================== */}

                  <div className="notification-list">

                    {notifications.map((item) => (

                      <div
                        key={item._id || item.id}
                        className={`notification-item ${
                          item.read ? "" : "unread"
                        }`}
                        onClick={() =>
                          markAsRead(item._id)
                        }
                      >
                        <div>

                          <strong>
                            {item.title}
                          </strong>

                          <p>
                            {item.message}
                          </p>

                          <small>
                            {new Date(
                              item.createdAt
                            ).toLocaleTimeString()}
                          </small>

                        </div>

                        {!item.read && (
                          <FiCheckCircle />
                        )}

                      </div>

                    ))}

                  </div>

                  {/* ==========================================
                      CLEAR ALL
                  ========================================== */}

                  <button
                    className="clear-btn"
                    onClick={clearNotifications}
                  >
                    Clear All
                  </button>
                </>
              )}

            </div>
          )}
        </div>

        {/* Profile */}

        <div
          className="profile-wrapper"
          ref={profileRef}
        >
          <div
            className="profile-box"
            onClick={() =>
              setShowProfileMenu(
                !showProfileMenu
              )
            }
          >
            <div className="profile-avatar">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="navbar-profile-image"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>

            <div className="profile-info">
              <h4>{user?.name}</h4>

              <span>{user?.email}</span>
            </div>

            <FiChevronDown />
          </div>

          {showProfileMenu && (
            <div className="profile-dropdown">

              <Link
                to="/profile"
                className="profile-dropdown-item"
              >
                Profile
              </Link>

              <Link
                to="/change-password"
                className="profile-dropdown-item"
              >
                Change Password
              </Link>

              <Link
                to="/settings"
                className="profile-dropdown-item"
              >
                Settings
              </Link>

              <button
                className="profile-dropdown-item logout-item"
                onClick={logout}
              >
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;