import { useEffect, useState } from "react";
import { FiX, FiClock } from "react-icons/fi";
import { toast } from "react-hot-toast";

import { getNoteVersions } from "../services/noteService";

import "./NoteVersionModal.css";

const NoteVersionModal = ({
  open,
  onClose,
  note,
}) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !note?._id) return;

    loadVersions();
  }, [open, note]);

  const loadVersions = async () => {
    try {
      setLoading(true);

      const res = await getNoteVersions(note._id);

      setVersions(res.versions || []);
    } catch (error) {
      console.error(
        "Load Note Versions Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load note versions"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="version-modal-overlay">

      <div className="version-modal-card">

        {/* HEADER */}

        <div className="version-modal-header">

          <div>
            <h2>Version History</h2>

            <p>
              {note?.title || "Note"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="version-close-btn"
          >
            <FiX />
          </button>

        </div>

        {/* CONTENT */}

        <div className="version-modal-content">

          {loading ? (
            <div className="version-loading">
              Loading versions...
            </div>
          ) : versions.length === 0 ? (
            <div className="version-empty">
              <FiClock />

              <h3>
                No Version History
              </h3>

              <p>
                Previous versions of this note
                will appear here after you edit it.
              </p>
            </div>
          ) : (
            <div className="version-list">

              {versions.map((version) => (

                <div
                  key={version._id}
                  className="version-item"
                >

                  {/* VERSION HEADER */}

                  <div className="version-item-header">

                    <div className="version-number">
                      <FiClock />

                      <strong>
                        Version{" "}
                        {version.versionNumber}
                      </strong>
                    </div>

                    <span className="version-date">
                      {version.editedAt
                        ? new Date(
                            version.editedAt
                          ).toLocaleString()
                        : version.createdAt
                        ? new Date(
                            version.createdAt
                          ).toLocaleString()
                        : ""}
                    </span>

                  </div>

                  {/* TITLE */}

                  <div className="version-title">
                    <strong>
                      {version.title}
                    </strong>
                  </div>

                  {/* CONTENT */}

                  <div className="version-content">
                    {version.content}
                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

        {/* FOOTER */}

        <div className="version-modal-footer">

          <button
            type="button"
            onClick={onClose}
            className="version-close-button"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
};

export default NoteVersionModal;