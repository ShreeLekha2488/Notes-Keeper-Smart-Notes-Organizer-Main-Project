import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  FiHome,
  FiFileText,
  FiFolder,
  FiTag,
  FiStar,
  FiArchive,
  FiTrash2,
  FiSearch,
  FiUser,
  FiLock,
  FiLogOut,
  FiBookmark,
} from "react-icons/fi";

import "./Sidebar.css";

const Sidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FiHome />,
      path: "/dashboard",
    },
    {
      title: "Notes",
      icon: <FiFileText />,
      path: "/notes",
    },
    {
      title: "Folders",
      icon: <FiFolder />,
      path: "/folders",
    },
    {
      title: "Tags",
      icon: <FiTag />,
      path: "/tags",
    },
    {
      title: "Pinned",
      icon: <FiBookmark />,
      path: "/pinned",
    },
    {
      title: "Favorites",
      icon: <FiStar />,
      path: "/favorites",
    },
    {
      title: "Archive",
      icon: <FiArchive />,
      path: "/archive",
    },
    {
      title: "Trash",
      icon: <FiTrash2 />,
      path: "/trash",
    },
    {
      title: "Search",
      icon: <FiSearch />,
      path: "/search",
    },
  ];

  return (
    <aside className="sidebar">
      <div>
        {/* Logo */}

        <div className="sidebar-logo">
          <h2>📝 Notes Keeper</h2>
        </div>

        {/* Menu */}

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              {item.icon}

              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom */}

      <div className="sidebar-bottom">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <FiUser />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/change-password"
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <FiLock />
          <span>Change Password</span>
        </NavLink>

        <button
          className="logout-btn"
          onClick={logout}
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;