import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import GridView from "../components/GridView";
import CreateNoteModal from "../components/CreateNoteModal";

import { getNotesByFolder } from "../services/noteService";

import "./Page.css";

const FolderNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [folder, setFolder] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    loadFolder();
  }, [id]);

  const loadFolder = async () => {
    try {
      setLoading(true);

      const res = await getNotesByFolder(id);

      if (res.success) {
        setFolder(res.folder);
        setNotes(res.notes);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar />

      <main className="page-container">

        <Navbar />

        <section className="page-content">

          <div className="page-header">

            <div>

              <button
                className="primary-btn"
                onClick={() => navigate("/folders")}
                style={{ marginBottom: 15 }}
              >
                ← Back
              </button>

              <h1>
                {folder?.icon} {folder?.name}
              </h1>

              <p>
                {folder?.color && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: folder.color,
                      marginRight: 8,
                    }}
                  />
                )}

                {notes.length} Notes
              </p>

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

          <GridView
            notes={notes}
            loading={loading}
            onEdit={(note) => {
              setSelectedNote(note);
              setShowModal(true);
            }}
          />

          <CreateNoteModal
            open={showModal}
            note={selectedNote}
            onClose={() => {
              setShowModal(false);
              setSelectedNote(null);
            }}
            refresh={loadFolder}
          />

        </section>

      </main>
    </>
  );
};

export default FolderNotes;