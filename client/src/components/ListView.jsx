import {
  MdPushPin,
  MdFavorite,
  MdArchive,
  MdDelete,
  MdEdit,
} from "react-icons/md";

import Loader from "./Loader";

const ListView = ({
  notes = [],
  loading = false,
  onEdit,
  onPin,
  onFavorite,
  onArchive,
  onTrash,
}) => {
  if (loading) {
    return <Loader text="Loading notes..." />;
  }

  if (!loading && notes.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-600">
          No Notes Found
        </h2>

        <p className="text-gray-500 mt-2">
          Create your first note to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">

        <thead className="bg-gray-100">
          <tr>

            <th className="text-left px-6 py-4">Title</th>

            <th className="text-left px-6 py-4">
              Content
            </th>

            <th className="text-left px-6 py-4">
              Updated
            </th>

            <th className="text-center px-6 py-4">
              Actions
            </th>

          </tr>
        </thead>

        <tbody>

          {notes.map((note) => (
            <tr
              key={note._id}
              className="border-t hover:bg-gray-50 transition"
            >

              <td className="px-6 py-5 font-semibold">
                {note.title}
              </td>

              <td className="px-6 py-5">
                <p className="line-clamp-2">
                  {note.content}
                </p>
              </td>

              <td className="px-6 py-5">
                {new Date(note.updatedAt).toLocaleDateString()}
              </td>

              <td className="px-6 py-5">

                <div className="flex justify-center gap-3">

                  <button
                    onClick={() => onPin(note._id)}
                    className={
                      note.isPinned
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }
                  >
                    <MdPushPin size={20} />
                  </button>

                  <button
                    onClick={() => onFavorite(note._id)}
                    className={
                      note.isFavorite
                        ? "text-pink-500"
                        : "text-gray-400"
                    }
                  >
                    <MdFavorite size={20} />
                  </button>

                  <button
                    onClick={() => onArchive(note._id)}
                    className={
                      note.isArchived
                        ? "text-blue-500"
                        : "text-gray-400"
                    }
                  >
                    <MdArchive size={20} />
                  </button>

                  <button
                    onClick={() => onEdit(note)}
                    className="text-green-600"
                  >
                    <MdEdit size={20} />
                  </button>

                  <button
                    onClick={() => onTrash(note._id)}
                    className="text-red-600"
                  >
                    <MdDelete size={20} />
                  </button>

                </div>

              </td>

            </tr>
          ))}

        </tbody>

      </table>
    </div>
  );
};

export default ListView;