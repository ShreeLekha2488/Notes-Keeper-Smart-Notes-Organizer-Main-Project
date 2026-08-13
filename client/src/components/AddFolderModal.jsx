import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";
import "./AddFolderModal.css";

import {
  createFolder,
  updateFolder,
} from "../services/folderService";

const AddFolderModal = ({
  open,
  onClose,
  refresh,
  folder,
}) => {
  const [form, setForm] = useState({
    name: "",
    color: "#3B82F6",
    icon: "📁",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (folder) {
      setForm({
        name: folder.name || "",
        color: folder.color || "#3B82F6",
        icon: folder.icon || "📁",
        description: folder.description || "",
      });
    } else {
      setForm({
        name: "",
        color: "#3B82F6",
        icon: "📁",
        description: "",
      });
    }
  }, [open, folder]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Folder name is required");
      return;
    }

    try {
      setLoading(true);

      if (folder) {
        await updateFolder(folder._id, form);
        toast.success("Folder updated");
      } else {
        await createFolder(form);
        toast.success("Folder created");
      }

      refresh();
      onClose();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to save folder"
      );

    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">

      <div className="modal-card">

        <div className="modal-header">

          <h2>
            {folder ? "Edit Folder" : "Create Folder"}
          </h2>

          <button onClick={onClose}>
            <FiX />
          </button>

        </div>

        <form
          className="folder-form"
          onSubmit={handleSubmit}
        >

          <label>Folder Name</label>

          <input
            type="text"
            name="name"
            placeholder="Work"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Icon</label>

          <input
            type="text"
            name="icon"
            value={form.icon}
            onChange={handleChange}
          />

          <label>Color</label>

          <input
            type="color"
            name="color"
            value={form.color}
            onChange={handleChange}
          />

          <label>Description</label>

          <textarea
            rows="4"
            name="description"
            placeholder="Folder Description"
            value={form.description}
            onChange={handleChange}
          />

          <div className="folder-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : folder
                ? "Update Folder"
                : "Create Folder"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddFolderModal;