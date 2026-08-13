import {
  FiEdit2,
  FiTrash2,
  FiFolder,
  FiFileText,
  FiChevronRight,
} from "react-icons/fi";

import "./FolderCard.css";

const FolderCard = ({
  folder,
  onEdit,
  onDelete,
  onOpen,
}) => {
  return (
    <div
      className="folder-card"
      onClick={() => {
        if (onOpen) {
          onOpen(folder);
        }
      }}
    >
      {/* Top */}

      <div className="folder-card-top">

        <div
          className="folder-icon"
          style={{
            background:
              folder.color || "#3B82F6",
          }}
        >
          {folder.icon ? (
            <span>{folder.icon}</span>
          ) : (
            <FiFolder />
          )}
        </div>

        <div className="folder-actions">

          <button
            className="edit-btn"
            title="Edit Folder"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(folder);
            }}
          >
            <FiEdit2 />
          </button>

          <button
            className="delete-btn"
            title="Delete Folder"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(folder);
            }}
          >
            <FiTrash2 />
          </button>

        </div>

      </div>

      {/* Body */}

      <div className="folder-body">

        <h3>{folder.name}</h3>

        <p>
          {folder.description?.trim()
            ? folder.description
            : "No description available"}
        </p>

      </div>

      {/* Footer */}

      <div className="folder-footer">

        <div className="folder-note-count">

          <FiFileText />

          <span>
            {folder.noteCount || 0} Notes
          </span>

        </div>

        <div className="folder-open">

          <span>Open</span>

          <FiChevronRight />

        </div>

      </div>

    </div>
  );
};

export default FolderCard;