import { MdWarning } from "react-icons/md";

const DeleteModal = ({
  isOpen,
  title = "Delete",
  message = "Are you sure you want to delete this item?",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.20)",
          textAlign: "center",
        }}
      >
        {/* Warning Icon */}
        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 18px",
            borderRadius: "50%",
            background: "#fee2e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MdWarning
            style={{
              color: "#dc2626",
              fontSize: "36px",
            }}
          />
        </div>

        {/* Title */}
        <h2
          style={{
            margin: "0 0 10px",
            fontSize: "26px",
            fontWeight: "700",
            color: "#0f172a",
          }}
        >
          {title}
        </h2>

        {/* Message */}
        <p
          style={{
            margin: "0 auto",
            maxWidth: "380px",
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#64748b",
          }}
        >
          {message}
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "28px",
          }}
        >
          {/* Cancel */}
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px 18px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#334155",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {cancelText}
          </button>

          {/* Delete Forever */}
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px 18px",
              borderRadius: "10px",
              border: "none",
              background: "#dc2626",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Please Wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;