import { useEffect, useState } from "react";
import {
  MdFolder,
  MdCreateNewFolder,
  MdDelete,
  MdEdit,
} from "react-icons/md";

import API from "../services/api";

const FolderSidebar = ({ selectedFolder, onSelectFolder }) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFolders = async () => {
    try {
      const { data } = await API.get("/folders");
      setFolders(data.folders || []);
    } catch (error) {
      console.error("Failed to load folders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        Loading folders...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 h-full">

      {/* Header */}

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-xl font-semibold">
          Folders
        </h2>

        <button
          className="text-blue-600 hover:text-blue-700"
        >
          <MdCreateNewFolder size={24} />
        </button>

      </div>

      {/* All Notes */}

      <button
        onClick={() => onSelectFolder(null)}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-2 transition ${
          selectedFolder === null
            ? "bg-blue-600 text-white"
            : "hover:bg-gray-100"
        }`}
      >
        <MdFolder size={22} />
        All Notes
      </button>

      {/* Folder List */}

      {folders.map((folder) => (
        <div
          key={folder._id}
          className={`flex items-center justify-between px-3 py-3 rounded-lg mb-2 cursor-pointer transition ${
            selectedFolder === folder._id
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100"
          }`}
          onClick={() => onSelectFolder(folder._id)}
        >

          <div className="flex items-center gap-3">

            <MdFolder size={20} />

            <span>{folder.name}</span>

          </div>

          <div className="flex items-center gap-2">

            <button
              className="hover:text-yellow-500"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Edit Folder", folder._id);
              }}
            >
              <MdEdit />
            </button>

            <button
              className="hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Delete Folder", folder._id);
              }}
            >
              <MdDelete />
            </button>

          </div>

        </div>
      ))}

    </div>
  );
};

export default FolderSidebar;