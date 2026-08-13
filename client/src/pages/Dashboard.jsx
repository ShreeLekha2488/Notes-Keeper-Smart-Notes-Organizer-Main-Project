import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { useAuth } from "../context/AuthContext";

import {
  FiFileText,
  FiFolder,
  FiStar,
  FiArchive,
} from "react-icons/fi";

import {
  getDashboardStats,
  getRecentNotes,
  getFavoriteNotes,
  getFolders,
} from "../services/dashboardService";

import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalNotes: 0,
    totalFolders: 0,
    favoriteNotes: 0,
    archivedNotes: 0,
  });

  const [recentNotes, setRecentNotes] = useState([]);
  const [favoriteNotes, setFavoriteNotes] = useState([]);
  const [folders, setFolders] = useState([]);

  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    loadDashboard();

    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        statsRes,
        notesRes,
        favoritesRes,
        foldersRes,
      ] = await Promise.allSettled([
        getDashboardStats(),
        getRecentNotes(),
        getFavoriteNotes(),
        getFolders(),
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value.success) {
        setStats(statsRes.value.stats);
      }

      if (notesRes.status === "fulfilled" && notesRes.value.success) {
        setRecentNotes(notesRes.value.notes);
      }

      if (favoritesRes.status === "fulfilled" && favoritesRes.value.success) {
        setFavoriteNotes(favoritesRes.value.notes);
      }

      if (foldersRes.status === "fulfilled" && foldersRes.value.success) {
        setFolders(foldersRes.value.folders);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Notes",
      value: stats.totalNotes,
      icon: <FiFileText />,
      color: "#2563eb",
    },
    {
      title: "Folders",
      value: stats.totalFolders,
      icon: <FiFolder />,
      color: "#7c3aed",
    },
    {
      title: "Favorites",
      value: stats.favoriteNotes,
      icon: <FiStar />,
      color: "#f59e0b",
    },
    {
      title: "Archived",
      value: stats.archivedNotes,
      icon: <FiArchive />,
      color: "#10b981",
    },
  ];

  return (
    <>
      <Sidebar />

      <div className="dashboard-container">

        <Navbar />

        <div className="dashboard-content">

          {/* Animated Welcome Banner */}

          {showWelcome && (
            <section className="welcome-flash">

              <div className="welcome-content">

                <h1>
                  👋 Welcome Back,
                  <span>
                    {" "}
                    {user?.name || "User"}
                  </span>
                </h1>

                <p>
                  Manage your notes efficiently with your
                  personal workspace.
                </p>

              </div>

            </section>
          )}

          {/* Statistics */}

          <section className="stats-grid">

            {statCards.map((item, index) => (

              <div
                className="stat-card"
                key={index}
              >

                <div
                  className="stat-icon"
                  style={{
                    background: item.color,
                  }}
                >
                  {item.icon}
                </div>

                <div>

                  <h2>
                    {loading ? "--" : item.value}
                  </h2>

                  <p>{item.title}</p>

                </div>

              </div>

            ))}

          </section>

          {/* Dashboard Grid */}

          <section className="dashboard-grid">

            {/* Recent Notes */}

            <div className="dashboard-box">

              <h3>📝 Recent Notes</h3>

              {recentNotes.length === 0 ? (

                <p>No recent notes.</p>

              ) : (

                recentNotes.map((note) => (

                  <div
                    key={note._id}
                    className="list-item"
                  >
                    {note.title}
                  </div>

                ))

              )}

            </div>

            {/* Folders */}

            <div className="dashboard-box">

              <h3>📁 Recent Folders</h3>

              {folders.length === 0 ? (

                <p>No folders found.</p>

              ) : (

                folders.map((folder) => (

                  <div
                    key={folder._id}
                    className="list-item"
                  >
                    {folder.folderName}
                  </div>

                ))

              )}

            </div>

            {/* Favorite Notes */}

            <div className="dashboard-box">

              <h3>⭐ Favorite Notes</h3>

              {favoriteNotes.length === 0 ? (

                <p>No favorite notes.</p>

              ) : (

                favoriteNotes.map((note) => (

                  <div
                    key={note._id}
                    className="list-item"
                  >
                    {note.title}
                  </div>

                ))

              )}

            </div>

            {/* Activity */}

            <div className="dashboard-box">

              <h3>📈 Activity</h3>

              <p>

                Your workspace currently contains

                <strong> {stats.totalNotes} </strong>

                notes across

                <strong> {stats.totalFolders} </strong>

                folders.

              </p>

            </div>

          </section>

        </div>

      </div>
    </>
  );
};

export default Dashboard;