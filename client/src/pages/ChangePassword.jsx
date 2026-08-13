import { useState } from "react";
import { toast } from "react-hot-toast";

import { changePassword } from "../services/authService";

import "./ChangePassword.css";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getStrength = () => {
    const pwd = formData.newPassword;

    if (pwd.length < 6)
      return {
        text: "Weak",
        width: "30%",
        color: "#ef4444",
      };

    if (pwd.length < 10)
      return {
        text: "Medium",
        width: "65%",
        color: "#f59e0b",
      };

    return {
      text: "Strong",
      width: "100%",
      color: "#22c55e",
    };
  };

  const strength = getStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success(res.message);

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-page">
      <div className="password-card">

        <h2>🔒 Change Password</h2>

        <p>
          Keep your account secure by updating your password regularly.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="password-group">
            <label>Current Password</label>

            <div className="password-box">
              <input
                type={
                  showCurrent ? "text" : "password"
                }
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrent(!showCurrent)
                }
              >
                {showCurrent ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="password-group">
            <label>New Password</label>

            <div className="password-box">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="strength">
            <div
              className="strength-bar"
              style={{
                width: strength.width,
                background: strength.color,
              }}
            />

            <span style={{ color: strength.color }}>
              {strength.text}
            </span>
          </div>

          <div className="password-group">
            <label>Confirm Password</label>

            <div className="password-box">
              <input
                type={
                  showConfirm ? "text" : "password"
                }
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(!showConfirm)
                }
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            className="save-password-btn"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ChangePassword;