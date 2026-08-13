import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import GridView from "../components/GridView";
import CreateNoteModal from "../components/CreateNoteModal";
import NoteVersionModal from "../components/NoteVersionModal";

import {
  getAllNotes,
  toggleFavorite,
  togglePin,
  toggleArchive,
  moveToTrash,
} from "../services/noteService";

import "./Page.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // ==========================================================
  // NOTE VERSION HISTORY
  // ==========================================================

  const [showVersionModal, setShowVersionModal] =
    useState(false);

  const [versionNote, setVersionNote] =
    useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredNotes(notes);
      return;
    }

    const filtered = notes.filter((note) => {
      const title = note.title?.toLowerCase() || "";
      const content = note.content?.toLowerCase() || "";

      return (
        title.includes(search.toLowerCase()) ||
        content.includes(search.toLowerCase())
      );
    });

    setFilteredNotes(filtered);
  }, [search, notes]);

  const loadNotes = async () => {
    try {
      setLoading(true);

      const res = await getAllNotes();

      setNotes(res.notes || []);
      setFilteredNotes(res.notes || []);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load notes");
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (id) => {
    try {
      await toggleFavorite(id);
      toast.success("Favourite updated");
      loadNotes();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update favourite");
    }
  };

  const handlePin = async (id) => {
    try {
      await togglePin(id);
      toast.success("Pin updated");
      loadNotes();
    } catch (error) {
      console.log(error);
      toast.error("Failed to pin note");
    }
  };

  const handleArchive = async (id) => {
    try {
      await toggleArchive(id);
      toast.success("Archive updated");
      loadNotes();
    } catch (error) {
      console.log(error);
      toast.error("Failed to archive note");
    }
  };

  const handleTrash = async (id) => {
    try {
      await moveToTrash(id);
      toast.success("Moved to Trash");
      loadNotes();
    } catch (error) {
      console.log(error);
      toast.error("Failed to move note");
    }
  };

  // ==========================================================
  // NOTE VERSION HISTORY
  // ==========================================================

  const handleVersionHistory = (note) => {
    setVersionNote(note);
    setShowVersionModal(true);
  };

  return (
    <>
      <Sidebar />

      <main className="page-container">
        <Navbar />

        <section className="page-content">
          <div className="page-header">
            <div>
              <h1>📝 My Notes</h1>
              <p>Create and manage all your notes.</p>
            </div>

            <button
              className="primary-btn"
              onClick={() => {
                setSelectedNote(null);
                setShowModal(true);
              }}
            >
              + New Note
            </button>
          </div>

          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
          />

          <GridView
            notes={filteredNotes}
            loading={loading}
            onEdit={(note) => {
              setSelectedNote(note);
              setShowModal(true);
            }}
            onFavorite={handleFavorite}
            onPin={handlePin}
            onArchive={handleArchive}
            onTrash={handleTrash}
            onVersionHistory={handleVersionHistory}
          />

          <CreateNoteModal
            open={showModal}
            note={selectedNote}
            onClose={() => {
              setShowModal(false);
              setSelectedNote(null);
            }}
            refresh={loadNotes}
          />

          {/* ==================================================
              NOTE VERSION HISTORY MODAL
          ================================================== */}

          <NoteVersionModal
            open={showVersionModal}
            note={versionNote}
            onClose={() => {
              setShowVersionModal(false);
              setVersionNote(null);
            }}
          />
        </section>
      </main>
    </>
  );
};

export default Notes;