import { useEffect, useState } from "react";

const colors = [
  "#FFFFFF",
  "#F28B82",
  "#FBBC04",
  "#FFF475",
  "#CCFF90",
  "#A7FFEB",
  "#CBF0F8",
  "#AECBFA",
  "#D7AEFB",
  "#FDCFE8",
];

const NoteModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    color: "#FFFFFF",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        content: initialData.content || "",
        color: initialData.color || "#FFFFFF",
      });
    } else {
      setFormData({
        title: "",
        content: "",
        color: "#FFFFFF",
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div
        className="w-full max-w-2xl rounded-xl shadow-xl p-6"
        style={{
          backgroundColor: formData.color,
        }}
      >

        <h2 className="text-2xl font-bold mb-6">
          {initialData ? "Edit Note" : "Create Note"}
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 mb-4"
        />

        <textarea
          rows="10"
          name="content"
          placeholder="Write your note..."
          value={formData.content}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 resize-none"
        />

        <div className="flex gap-3 mt-6 flex-wrap">

          {colors.map((color) => (
            <button
              key={color}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  color,
                }))
              }
              className={`w-9 h-9 rounded-full border-2 ${
                formData.color === color
                  ? "border-black"
                  : "border-gray-300"
              }`}
              style={{
                backgroundColor: color,
              }}
            />
          ))}

        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {initialData ? "Update" : "Create"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default NoteModal;