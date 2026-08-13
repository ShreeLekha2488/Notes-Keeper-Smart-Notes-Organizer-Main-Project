import Loader from "./Loader";
import NoteCard from "./NoteCard";

const GridView = ({
  notes = [],
  loading = false,
  onEdit,
  onPin,
  onFavorite,
  onArchive,
  onTrash,
  onVersionHistory,
  isTrash = false,
}) => {
  if (loading) {
    return (
      <Loader text="Loading notes..." />
    );
  }

  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <h2>
          No Notes Found
        </h2>

        <p>
          Nothing available here.
        </p>
      </div>
    );
  }

  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <NoteCard
          key={note._id}
          note={note}
          onEdit={onEdit}
          onPin={onPin}
          onFavorite={onFavorite}
          onArchive={onArchive}
          onTrash={onTrash}
          onVersionHistory={onVersionHistory}
          isTrash={isTrash}
        />
      ))}
    </div>
  );
};

export default GridView;