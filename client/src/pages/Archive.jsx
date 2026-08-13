import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import SearchBar from "../components/SearchBar";
import GridView from "../components/GridView";

import {
  getArchivedNotes,
  toggleArchive,
  toggleFavorite,
  togglePin,
  moveToTrash,
} from "../services/noteService";

import "./Page.css";

const Archive = () => {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadArchive();
  }, []);

  useEffect(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      setFilteredNotes(notes);
      return;
    }

    const filtered = notes.filter((note) => {
      const title = note.title?.toLowerCase() || "";
      const content = note.content?.toLowerCase() || "";

      const folder =
        note.folder?.name?.toLowerCase() ||
        note.folder?.folderName?.toLowerCase() ||
        "";

      const tags = Array.isArray(note.tags)
        ? note.tags
            .map((tag) =>
              typeof tag === "string"
                ? tag.toLowerCase()
                : tag?.name?.toLowerCase() || ""
            )
            .join(" ")
        : "";

      return (
        title.includes(keyword) ||
        content.includes(keyword) ||
        folder.includes(keyword) ||
        tags.includes(keyword)
      );
    });

    setFilteredNotes(filtered);
  }, [search, notes]);

  const loadArchive = async () => {
    try {
      setLoading(true);

      const res = await getArchivedNotes();

      const archivedNotes = res.notes || [];

      setNotes(archivedNotes);
      setFilteredNotes(archivedNotes);
    } catch (error) {
      console.error("Load Archive Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load archived notes"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      await toggleArchive(id);

      toast.success("Note restored");

      await loadArchive();
    } catch (error) {
      console.error(error);

      toast.error("Failed to restore note");
    }
  };

  const handleFavorite = async (id) => {
    try {
      await toggleFavorite(id);

      toast.success("Favorite updated");

      await loadArchive();
    } catch (error) {
      console.error(error);

      toast.error("Failed to update favorite");
    }
  };

  const handlePin = async (id) => {
    try {
      await togglePin(id);

      toast.success("Pin updated");

      await loadArchive();
    } catch (error) {
      console.error(error);

      toast.error("Failed to update pin");
    }
  };

  const handleTrash = async (id) => {
    try {
      await moveToTrash(id);

      toast.success("Moved to Trash");

      await loadArchive();
    } catch (error) {
      console.error(error);

      toast.error("Failed to move note to Trash");
    }
  };

  const handleEdit = (note) => {
    navigate(`/edit-note/${note._id}`);
  };

  return (
    <>
      <Sidebar />

      <main className="page-container">
        <Navbar />

        <section className="page-content">

          <div className="page-header">
            <div>
              <h1>📦 Archived Notes</h1>

              <p>
                Your archived notes collection.
              </p>
            </div>
          </div>

          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
          />

          <GridView
            notes={filteredNotes}
            loading={loading}
            onEdit={handleEdit}
            onPin={handlePin}
            onFavorite={handleFavorite}
            onArchive={handleRestore}
            onTrash={handleTrash}
          />

        </section>
      </main>
    </>
  );
};

export default Archive;