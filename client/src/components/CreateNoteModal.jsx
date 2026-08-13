import { useEffect, useState } from "react";
import {
  FiX,
  FiStar,
  FiBookmark,
  FiArchive,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import {
  createNote,
  updateNote,
} from "../services/noteService";

import { getFolders } from "../services/dashboardService";
import { getTags } from "../services/tagService";

import { useNotifications } from "../context/NotificationContext";

import "./CreateNoteModal.css";

const colors = [
  "#ffffff",
  "#fef3c7",
  "#fee2e2",
  "#dbeafe",
  "#dcfce7",
  "#ede9fe",
  "#fce7f3",
];

const CreateNoteModal = ({
  open,
  onClose,
  refresh,
  note,
}) => {
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);

  const [loading, setLoading] = useState(false);

  const {
    loadNotifications,
  } = useNotifications();

  const [form, setForm] = useState({
    title: "",
    content: "",
    folder: "",
    favorite: false,
    pinned: false,
    archived: false,
    tags: [],
    color: "#ffffff",
  });

  useEffect(() => {
    if (!open) return;

    loadFolders();
    loadTags();

    if (note) {
      setForm({
        title: note.title || "",
        content: note.content || "",
        folder: note.folder?._id || "",
        favorite: note.favorite || note.isFavorite || false,
        pinned: note.pinned || note.isPinned || false,
        archived: note.archived || note.isArchived || false,
        tags: Array.isArray(note.tags)
          ? note.tags.map((tag) =>
              typeof tag === "string"
                ? tag
                : tag?.name || ""
            )
          : [],
        color: note.color || "#ffffff",
      });
    } else {
      setForm({
        title: "",
        content: "",
        folder: "",
        favorite: false,
        pinned: false,
        archived: false,
        tags: [],
        color: "#ffffff",
      });
    }
  }, [open, note]);

  const loadFolders = async () => {
    try {
      const res = await getFolders();
      setFolders(res.folders || []);
    } catch (err) {
      console.log("Load Folders Error:", err);
    }
  };

  /* ==========================================================
     LOAD TAGS FROM MONGODB
  ========================================================== */

  const loadTags = async () => {
    try {
      const res = await getTags();

      setTags(res.tags || []);
    } catch (err) {
      console.log("Load Tags Error:", err);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggle = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  /* ==========================================================
     TAG DROPDOWN
  ========================================================== */

  const handleTagChange = (e) => {
    const selectedTag = e.target.value;

    if (!selectedTag) return;

    setForm((prev) => {
      if (prev.tags.includes(selectedTag)) {
        return prev;
      }

      return {
        ...prev,
        tags: [...prev.tags, selectedTag],
      };
    });
  };

  const removeTag = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter(
        (tag) => tag !== tagToRemove
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        tags: form.tags.filter(Boolean),
      };

      if (note) {
        await updateNote(note._id, payload);
        toast.success("Note updated");
      } else {
        await createNote(payload);
        toast.success("Note created");
      }

      // ==========================================================
      // REFRESH NOTIFICATIONS FROM MONGODB
      // ==========================================================

      await loadNotifications();

      refresh();
      onClose();
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Unable to save note"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-card"
        style={{
          background: form.color,
        }}
      >
        <div className="modal-header">
          <h2>
            {note ? "Edit Note" : "Create Note"}
          </h2>

          <button onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form
          className="note-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="title"
            placeholder="Note title..."
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            rows="4"
            name="content"
            placeholder="Write your note..."
            value={form.content}
            onChange={handleChange}
          />

          {/* FOLDER */}

          <select
            name="folder"
            value={form.folder}
            onChange={handleChange}
          >
            <option value="">
              No Folder
            </option>

            {folders.map((folder) => (
              <option
                key={folder._id}
                value={folder._id}
              >
                {folder.name}
              </option>
            ))}
          </select>

          {/* TAGS DROPDOWN */}

          <select
            value=""
            onChange={handleTagChange}
          >
            <option value="">
              Select Tags
            </option>

            {tags.length === 0 ? (
              <option disabled>
                No tags available
              </option>
            ) : (
              tags.map((tag) => (
                <option
                  key={tag._id}
                  value={tag.name}
                >
                  {tag.name}
                </option>
              ))
            )}
          </select>

          {/* SELECTED TAGS */}

          {form.tags.length > 0 && (
            <div className="selected-tags">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="selected-tag"
                >
                  {tag}

                  <button
                    type="button"
                    onClick={() =>
                      removeTag(tag)
                    }
                  >
                    <FiX />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* NOTE OPTIONS */}

          <div className="note-options">
            <button
              type="button"
              className={
                form.favorite
                  ? "option-btn active"
                  : "option-btn"
              }
              onClick={() =>
                toggle("favorite")
              }
            >
              <FiStar />
              Favourite
            </button>

            <button
              type="button"
              className={
                form.pinned
                  ? "option-btn active"
                  : "option-btn"
              }
              onClick={() =>
                toggle("pinned")
              }
            >
              <FiBookmark />
              Pin
            </button>

            <button
              type="button"
              className={
                form.archived
                  ? "option-btn active"
                  : "option-btn"
              }
              onClick={() =>
                toggle("archived")
              }
            >
              <FiArchive />
              Archive
            </button>
          </div>

          {/* CARD COLOR */}

          <div className="color-picker">
            <label>Card Color</label>

            <div className="colors">
              {colors.map((color) => (
                <span
                  key={color}
                  className={
                    form.color === color
                      ? "color active"
                      : "color"
                  }
                  style={{
                    background: color,
                  }}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      color,
                    }))
                  }
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="save-note-btn"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : note
              ? "Update Note"
              : "Save Note"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNoteModal;