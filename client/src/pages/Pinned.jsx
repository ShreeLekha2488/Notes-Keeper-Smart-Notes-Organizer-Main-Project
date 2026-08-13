import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import GridView from "../components/GridView";

import {
  getPinnedNotes,
  toggleFavorite,
  togglePin,
  toggleArchive,
  moveToTrash,
} from "../services/noteService";

import "./Page.css";

const Pinned = () => {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ==========================================================
  // LOAD PINNED NOTES
  // ==========================================================

  const loadPinnedNotes = async () => {
    try {
      setLoading(true);

      const res = await getPinnedNotes();

      const pinnedNotes = res.notes || [];

      setNotes(pinnedNotes);
      setFilteredNotes(pinnedNotes);
    } catch (error) {
      console.error(
        "Load Pinned Notes Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load pinned notes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPinnedNotes();
  }, []);

  // ==========================================================
  // SEARCH PINNED NOTES
  // ==========================================================

  useEffect(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      setFilteredNotes(notes);
      return;
    }

    const filtered = notes.filter((note) => {
      const title =
        note.title?.toLowerCase() || "";

      const content =
        note.content?.toLowerCase() || "";

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

  // ==========================================================
  // UNPIN NOTE
  // ==========================================================

  const handlePin = async (id) => {
    try {
      await togglePin(id);

      toast.success("Removed from Pinned");

      await loadPinnedNotes();
    } catch (error) {
      console.error("Pin Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update pinned note"
      );
    }
  };

  // ==========================================================
  // FAVORITE
  // ==========================================================

  const handleFavorite = async (id) => {
    try {
      await toggleFavorite(id);

      toast.success("Favorite updated");

      await loadPinnedNotes();
    } catch (error) {
      console.error(
        "Favorite Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update favorite"
      );
    }
  };

  // ==========================================================
  // ARCHIVE
  // ==========================================================

  const handleArchive = async (id) => {
    try {
      await toggleArchive(id);

      toast.success("Note archived");

      await loadPinnedNotes();
    } catch (error) {
      console.error(
        "Archive Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to archive note"
      );
    }
  };

  // ==========================================================
  // MOVE TO TRASH
  // ==========================================================

  const handleTrash = async (id) => {
    try {
      await moveToTrash(id);

      toast.success("Moved to Trash");

      await loadPinnedNotes();
    } catch (error) {
      console.error(
        "Trash Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to move note to Trash"
      );
    }
  };

  // ==========================================================
  // EDIT NOTE
  // ==========================================================

  const handleEdit = (note) => {
    navigate(`/edit-note/${note._id}`);
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <>
      <Sidebar />

      <main className="page-container">
        <Navbar />

        <section className="page-content">

          <div className="page-header">
            <div>
              <h1>📌 Pinned Notes</h1>

              <p>
                Your important notes that you have pinned.
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
            onFavorite={handleFavorite}
            onPin={handlePin}
            onArchive={handleArchive}
            onTrash={handleTrash}
          />

        </section>
      </main>
    </>
  );
};

export default Pinned;