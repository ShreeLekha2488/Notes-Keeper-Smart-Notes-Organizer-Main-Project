const colors = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
  "bg-red-100 text-red-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-indigo-100 text-indigo-700",
];

const TagBadge = ({
  tag,
  removable = false,
  onRemove,
  clickable = false,
  onClick,
}) => {
  const color =
    colors[tag?.name?.length % colors.length] ||
    colors[0];

  return (
    <span
      onClick={() => clickable && onClick?.(tag)}
      className={`
        inline-flex
        items-center
        gap-2
        px-3
        py-1
        rounded-full
        text-sm
        font-medium
        transition
        ${color}
        ${clickable ? "cursor-pointer hover:scale-105" : ""}
      `}
    >
      #{tag?.name}

      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.(tag);
          }}
          className="font-bold hover:text-red-600"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default TagBadge;