import {
  FiStar,
  FiArchive,
  FiTrash2,
  FiEdit,
  FiRotateCcw,
  FiTrash,
  FiBookmark,
  FiTag,
  FiFolder,
  FiClock,
} from "react-icons/fi";

const NoteCard = ({
  note,
  onEdit,
  onPin,
  onFavorite,
  onArchive,
  onTrash,
  onVersionHistory,
  isTrash = false,
}) => {
  return (
    <div
      className="note-card"
      style={{
        background: note.color || "#ffffff",
      }}
    >
      {/* Header */}

      <div className="note-card-header">

        <div>

          <h3>{note.title}</h3>

          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "8px",
              flexWrap: "wrap",
            }}
          >
            {note.isPinned && (
              <span className="badge pin">
                📌 Pinned
              </span>
            )}

            {note.isFavorite && (
              <span className="badge favourite">
                ⭐ Favourite
              </span>
            )}

            {note.isArchived && (
              <span className="badge archive">
                📦 Archived
              </span>
            )}
          </div>

        </div>

        <div className="note-actions">

          {!isTrash && (
            <>
              <button
                title="Favourite"
                onClick={() =>
                  onFavorite &&
                  onFavorite(note._id)
                }
              >
                <FiStar
                  color={
                    note.isFavorite
                      ? "#f59e0b"
                      : ""
                  }
                />
              </button>

              <button
                title="Pin"
                onClick={() =>
                  onPin &&
                  onPin(note._id)
                }
              >
                <FiBookmark
                  color={
                    note.isPinned
                      ? "#2563eb"
                      : ""
                  }
                />
              </button>

              <button
                title="Archive"
                onClick={() =>
                  onArchive &&
                  onArchive(note._id)
                }
              >
                <FiArchive />
              </button>

              <button
                title="Edit"
                onClick={() =>
                  onEdit &&
                  onEdit(note)
                }
              >
                <FiEdit />
              </button>

              {/* Version History */}

              <button
                title="Version History"
                onClick={() =>
                  onVersionHistory &&
                  onVersionHistory(note)
                }
              >
                <FiClock />
              </button>

              <button
                title="Move To Trash"
                onClick={() =>
                  onTrash &&
                  onTrash(note._id)
                }
              >
                <FiTrash2 />
              </button>
            </>
          )}

          {isTrash && (
            <>
              <button
                title="Restore"
                onClick={() =>
                  onPin &&
                  onPin(note._id)
                }
              >
                <FiRotateCcw />
              </button>

              <button
                title="Delete Forever"
                onClick={() =>
                  onTrash &&
                  onTrash(note._id)
                }
              >
                <FiTrash />
              </button>
            </>
          )}

        </div>

      </div>

      {/* Content */}

      <p className="note-content">
        {note.content}
      </p>

      {/* Tags */}

      {note.tags &&
        note.tags.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "15px",
            }}
          >
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="tag-chip"
              >
                <FiTag />
                {typeof tag === "string"
                  ? tag
                  : tag.name}
              </span>
            ))}
          </div>
        )}

      {/* Footer */}

      <div className="note-footer">

        <span>

          <FiFolder />

          {note.folder?.name ||
            note.folder?.folderName ||
            "No Folder"}

        </span>

        <span>
          {note.updatedAt
            ? new Date(
                note.updatedAt
              ).toLocaleDateString()
            : ""}
        </span>

      </div>

    </div>
  );
};

export default NoteCard;