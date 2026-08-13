import {
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiStar, FiBookmark, FiArchive } from "react-icons/fi";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { getAllNotes } from "../services/noteService";

import "./Page.css";

const Search = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(
    searchParams.get("keyword") || ""
  );

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const res = await getAllNotes();

      const allNotes = res.notes || [];

      setNotes(allNotes);

      const urlKeyword =
        searchParams.get("keyword") || "";

      if (urlKeyword.trim()) {
        const searchValue = urlKeyword
          .toLowerCase()
          .trim();

        const filtered = allNotes.filter((note) => {
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
            title.includes(searchValue) ||
            content.includes(searchValue) ||
            folder.includes(searchValue) ||
            tags.includes(searchValue)
          );
        });

        setFilteredNotes(filtered);
      } else {
        setFilteredNotes(allNotes);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (value) => {
    setKeyword(value);

    if (!value.trim()) {
      setFilteredNotes(notes);
      return;
    }

    const searchValue =
      value.toLowerCase().trim();

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
        title.includes(searchValue) ||
        content.includes(searchValue) ||
        folder.includes(searchValue) ||
        tags.includes(searchValue)
      );
    });

    setFilteredNotes(filtered);
  };

  return (
    <>
      <Sidebar />

      <main className="page-container">
        <Navbar />

        <section className="page-content">
          <div className="page-header">
            <div>
              <h1>🔍 Search Notes</h1>
              <p>Find your notes instantly.</p>
            </div>
          </div>

          <div className="search-container">
            <FiSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search by title or content..."
              value={keyword}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
            />
          </div>

          {filteredNotes.length === 0 ? (
            <div className="empty-card">
              <h2>No Notes Found</h2>
              <p>Try another keyword.</p>
            </div>
          ) : (
            <div className="notes-grid">
              {filteredNotes.map((note) => (
                <div
                  key={note._id}
                  className="note-card"
                  style={{
                    background:
                      note.color || "#ffffff",
                  }}
                >
                  <div className="note-card-header">
                    <h3>{note.title}</h3>

                    <div className="note-actions">
                      {note.favorite && (
                        <FiStar color="#f59e0b" />
                      )}

                      {note.pinned && (
                        <FiBookmark color="#2563eb" />
                      )}

                      {note.archived && (
                        <FiArchive color="#64748b" />
                      )}
                    </div>
                  </div>

                  <div className="note-content">
                    {note.content}
                  </div>

                  <div className="note-footer">
                    <span>
                      {note.folder?.name || "No Folder"}
                    </span>

                    <span>
                      {new Date(
                        note.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Search;