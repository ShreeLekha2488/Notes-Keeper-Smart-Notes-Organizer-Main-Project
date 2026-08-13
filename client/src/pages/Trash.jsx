import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import GridView from "../components/GridView";
import DeleteModal from "../components/DeleteModal";

import {
  getTrashNotes,
  restoreNote,
  deleteForever,
} from "../services/noteService";

import "./Page.css";

const Trash = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedNote, setSelectedNote] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  /* ==========================================
     LOAD TRASH NOTES
  ========================================== */

  useEffect(() => {
    loadTrash();
  }, []);

  /* ==========================================
     SEARCH
  ========================================== */

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

  /* ==========================================
     GET TRASH NOTES
  ========================================== */

  const loadTrash = async () => {
    try {
      setLoading(true);

      const res = await getTrashNotes();

      const trashNotes = res.notes || [];

      setNotes(trashNotes);
      setFilteredNotes(trashNotes);
    } catch (error) {
      console.error("Load Trash Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load Trash"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
     RESTORE
  ========================================== */

  const handleRestore = async (id) => {
    try {
      await restoreNote(id);

      toast.success("Note restored successfully");

      await loadTrash();
    } catch (error) {
      console.error(
        "Restore Note Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to restore note"
      );
    }
  };

  /* ==========================================
     OPEN DELETE MODAL
  ========================================== */

  const openDeleteModal = (id) => {
    setSelectedNote(id);
    setShowDelete(true);
  };

  /* ==========================================
     DELETE FOREVER
  ========================================== */

  const handleDeleteForever = async () => {
    if (!selectedNote) return;

    try {
      await deleteForever(selectedNote);

      toast.success(
        "Note permanently deleted"
      );

      setShowDelete(false);
      setSelectedNote(null);

      await loadTrash();
    } catch (error) {
      console.error(
        "Delete Forever Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to permanently delete note"
      );
    }
  };

  /* ==========================================
     CLOSE DELETE MODAL
  ========================================== */

  const closeDeleteModal = () => {
    setShowDelete(false);
    setSelectedNote(null);
  };

  return (
    <>
      <Sidebar />

      <main className="page-container">

        <Navbar />

        <section className="page-content">

          {/* ==================================
              HEADER
          ================================== */}

          <div className="page-header">

            <div>
              <h1>🗑 Trash</h1>

              <p>
                Deleted notes are stored here.
              </p>
            </div>

          </div>

          {/* ==================================
              SEARCH
          ================================== */}

          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
          />

          {/* ==================================
              NOTES
          ================================== */}

          <GridView
            notes={filteredNotes}
            loading={loading}
            isTrash={true}
            onPin={handleRestore}
            onTrash={openDeleteModal}
          />

          {/* ==================================
              DELETE FOREVER MODAL
          ================================== */}

          <DeleteModal
            isOpen={showDelete}
            title="Delete Forever"
            message="This note will be permanently removed and cannot be recovered."
            confirmText="Delete Forever"
            onConfirm={handleDeleteForever}
            onCancel={closeDeleteModal}
          />

        </section>

      </main>
    </>
  );
};

export default Trash;