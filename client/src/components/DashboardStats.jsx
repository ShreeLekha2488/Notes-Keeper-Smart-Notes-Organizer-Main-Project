import { useEffect, useState } from "react";
import API from "../services/api";

import {
  MdStickyNote2,
  MdFavorite,
  MdArchive,
  MdDelete,
} from "react-icons/md";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalNotes: 0,
    favoriteNotes: 0,
    archivedNotes: 0,
    trashedNotes: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/notes/dashboard/stats");

      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Notes",
      value: stats.totalNotes,
      icon: <MdStickyNote2 size={28} />,
      bg: "bg-blue-500",
    },
    {
      title: "Favorites",
      value: stats.favoriteNotes,
      icon: <MdFavorite size={28} />,
      bg: "bg-pink-500",
    },
    {
      title: "Archived",
      value: stats.archivedNotes,
      icon: <MdArchive size={28} />,
      bg: "bg-yellow-500",
    },
    {
      title: "Trash",
      value: stats.trashedNotes,
      icon: <MdDelete size={28} />,
      bg: "bg-red-500",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white rounded-xl h-32 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between"
        >
          <div>
            <p className="text-gray-500 text-sm">
              {card.title}
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {card.value}
            </h2>
          </div>

          <div
            className={`${card.bg} text-white p-4 rounded-full`}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;