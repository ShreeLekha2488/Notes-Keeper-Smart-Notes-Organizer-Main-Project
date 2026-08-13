import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  FiFileText,
  FiFolder,
  FiStar,
  FiArchive,
} from "react-icons/fi";

import "./Dashboard.css";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Notes",
      value: 0,
      icon: <FiFileText />,
      color: "#2563eb",
    },
    {
      title: "Folders",
      value: 0,
      icon: <FiFolder />,
      color: "#7c3aed",
    },
    {
      title: "Favorites",
      value: 0,
      icon: <FiStar />,
      color: "#f59e0b",
    },
    {
      title: "Archived",
      value: 0,
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

          {/* Welcome */}

          <section className="welcome-card">

            <h1>
              Welcome to Notes Keeper 👋
            </h1>

            <p>
              Organize your notes, folders, favorites and
              archives in one place.
            </p>

          </section>

          {/* Statistics */}

          <section className="stats-grid">

            {stats.map((item, index) => (

              <div
                key={index}
                className="stat-card"
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

                  <h2>{item.value}</h2>

                  <p>{item.title}</p>

                </div>

              </div>

            ))}

          </section>

          {/* Dashboard Grid */}

          <section className="dashboard-grid">

            <div className="dashboard-box">

              <h3>📝 Recent Notes</h3>

              <p>
                No notes available.
              </p>

            </div>

            <div className="dashboard-box">

              <h3>📁 Recent Folders</h3>

              <p>
                No folders available.
              </p>

            </div>

            <div className="dashboard-box">

              <h3>⭐ Favorite Notes</h3>

              <p>
                No favorite notes.
              </p>

            </div>

            <div className="dashboard-box">

              <h3>📈 Activity</h3>

              <p>
                Your recent activity will appear here.
              </p>

            </div>

          </section>

        </div>

      </div>
    </>
  );
};

export default Dashboard;