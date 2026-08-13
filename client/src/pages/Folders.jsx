import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FolderCard from "../components/FolderCard";
import AddFolderModal from "../components/AddFolderModal";

import {
  getFolders,
  deleteFolder,
} from "../services/folderService";

import "./Page.css";

const Folders = () => {

  const navigate = useNavigate();

  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setLoading(true);

      const res = await getFolders();

      if (res.success) {
        setFolders(res.folders);
      }

    } catch (error) {
      console.log(error);
      toast.error("Unable to load folders");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (folder) => {

    const ok = window.confirm(
      `Delete "${folder.name}" ?`
    );

    if (!ok) return;

    try {

      const res = await deleteFolder(folder._id);

      if (res.success) {
        toast.success("Folder deleted");
        loadFolders();
      }

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to delete folder"
      );

    }
  };

  const handleEdit = (folder) => {
    setSelectedFolder(folder);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedFolder(null);
    setShowModal(true);
  };

  const handleOpen = (folder) => {
    console.log(folder);
  };

  return (
    <>
      <Sidebar />

      <main className="page-container">

        <Navbar />

        <section className="page-content">

          <div className="page-header">

            <div>

              <h1>📁 My Folders</h1>

              <p>
                Organize your notes into folders.
              </p>

            </div>

            <button
              className="primary-btn"
              onClick={handleCreate}
            >
              + Add Folder
            </button>

          </div>

          {loading ? (

            <div className="empty-card">

              <h2>Loading...</h2>

            </div>

          ) : folders.length === 0 ? (

            <div className="empty-card">

              <h2>No Folders</h2>

              <p>
                Click "Add Folder" to create your first
                folder.
              </p>

            </div>

          ) : (

            <div className="notes-grid">

              {folders.map((folder) => (

                <FolderCard
                  key={folder._id}
                  folder={folder}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onOpen={(folder) =>
                    navigate(`/folders/${folder._id}`)
                  }
                />

              ))}

            </div>

          )}

        </section>

      </main>

      <AddFolderModal
        open={showModal}
        folder={selectedFolder}
        refresh={loadFolders}
        onClose={() => {
          setShowModal(false);
          setSelectedFolder(null);
        }}
      />
    </>
  );
};

export default Folders;