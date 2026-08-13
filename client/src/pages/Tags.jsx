import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiTag,
  FiSearch,
} from "react-icons/fi";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
} from "../services/tagService";

import "./Tags.css";

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [editingTag, setEditingTag] = useState(null);

  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#3B82F6");

  const [saving, setSaving] = useState(false);

  /* ========================================================
     LOAD TAGS
  ======================================================== */

  const loadTags = async () => {
    try {
      setLoading(true);

      const res = await getTags();

      const tagList = res.tags || [];

      setTags(tagList);
      setFilteredTags(tagList);
    } catch (error) {
      console.error("Load Tags Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load tags"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  /* ========================================================
     SEARCH TAGS
  ======================================================== */

  useEffect(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      setFilteredTags(tags);
      return;
    }

    const filtered = tags.filter((tag) =>
      tag.name?.toLowerCase().includes(keyword)
    );

    setFilteredTags(filtered);
  }, [search, tags]);

  /* ========================================================
     OPEN CREATE MODAL
  ======================================================== */

  const handleCreate = () => {
    setEditingTag(null);
    setTagName("");
    setTagColor("#3B82F6");

    setShowModal(true);
  };

  /* ========================================================
     OPEN EDIT MODAL
  ======================================================== */

  const handleEdit = (tag) => {
    setEditingTag(tag);

    setTagName(tag.name || "");
    setTagColor(tag.color || "#3B82F6");

    setShowModal(true);
  };

  /* ========================================================
     CLOSE MODAL
  ======================================================== */

  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingTag(null);
    setTagName("");
    setTagColor("#3B82F6");
  };

  /* ========================================================
     SAVE TAG
  ======================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tagName.trim()) {
      toast.error("Please enter a tag name");
      return;
    }

    try {
      setSaving(true);

      if (editingTag) {
        const res = await updateTag(
          editingTag._id,
          {
            name: tagName.trim(),
            color: tagColor,
          }
        );

        toast.success(
          res.message || "Tag updated successfully"
        );
      } else {
        const res = await createTag({
          name: tagName.trim(),
          color: tagColor,
        });

        toast.success(
          res.message || "Tag created successfully"
        );
      }

      handleCloseModal();

      await loadTags();
    } catch (error) {
      console.error("Save Tag Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to save tag"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ========================================================
     DELETE TAG
  ======================================================== */

  const handleDelete = async (tag) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${tag.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteTag(tag._id);

      toast.success("Tag deleted successfully");

      await loadTags();
    } catch (error) {
      console.error("Delete Tag Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete tag"
      );
    }
  };

  return (
    <div className="tags-page">

      <Sidebar />

      <main className="page-container">

        <Navbar />

        <section className="tags-content">

          {/* HEADER */}

          <div className="tags-header">

            <div>
              <h1>
                <FiTag />
                Tags
              </h1>

              <p>
                Organize your notes using tags.
              </p>
            </div>

            <button
              className="create-tag-btn"
              onClick={handleCreate}
            >
              <FiPlus />
              Create Tag
            </button>

          </div>

          {/* SEARCH */}

          <div className="tags-search">

            <FiSearch />

            <input
              type="text"
              placeholder="Search tags..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* TAGS */}

          {loading ? (
            <div className="tags-empty">
              Loading tags...
            </div>
          ) : filteredTags.length === 0 ? (
            <div className="tags-empty">

              <FiTag />

              <h3>
                {search
                  ? "No tags found"
                  : "No tags yet"}
              </h3>

              <p>
                {search
                  ? "Try a different search."
                  : "Create your first tag to organize your notes."}
              </p>

              {!search && (
                <button
                  className="create-tag-btn"
                  onClick={handleCreate}
                >
                  <FiPlus />
                  Create Tag
                </button>
              )}

            </div>
          ) : (
            <div className="tags-grid">

              {filteredTags.map((tag) => (
                <div
                  className="tag-card"
                  key={tag._id}
                >

                  <div
                    className="tag-color"
                    style={{
                      backgroundColor:
                        tag.color || "#3B82F6",
                    }}
                  >
                    <FiTag />
                  </div>

                  <div className="tag-info">

                    <h3>
                      {tag.name}
                    </h3>

                    <span>
                      Tag
                    </span>

                  </div>

                  <div className="tag-actions">

                    <button
                      onClick={() =>
                        handleEdit(tag)
                      }
                      title="Edit Tag"
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(tag)
                      }
                      title="Delete Tag"
                      className="delete-tag-btn"
                    >
                      <FiTrash2 />
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </main>

      {/* CREATE / EDIT MODAL */}

      {showModal && (
        <div
          className="tag-modal-overlay"
          onClick={handleCloseModal}
        >

          <div
            className="tag-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h2>
              {editingTag
                ? "Edit Tag"
                : "Create New Tag"}
            </h2>

            <p>
              {editingTag
                ? "Update your tag details."
                : "Create a tag to organize your notes."}
            </p>

            <form onSubmit={handleSubmit}>

              <div className="tag-form-group">

                <label>
                  Tag Name
                </label>

                <input
                  type="text"
                  placeholder="Example: React"
                  value={tagName}
                  onChange={(e) =>
                    setTagName(e.target.value)
                  }
                  autoFocus
                />

              </div>

              <div className="tag-form-group">

                <label>
                  Tag Color
                </label>

                <div className="color-picker">

                  <input
                    type="color"
                    value={tagColor}
                    onChange={(e) =>
                      setTagColor(e.target.value)
                    }
                  />

                  <span>
                    {tagColor}
                  </span>

                </div>

              </div>

              <div className="tag-modal-actions">

                <button
                  type="button"
                  className="cancel-tag-btn"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-tag-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingTag
                    ? "Update Tag"
                    : "Create Tag"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Tags;