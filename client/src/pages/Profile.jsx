import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";

import {
  getProfile,
  updateProfile,
} from "../services/authService";

import { useAuth } from "../context/AuthContext";

import "./Profile.css";

const Profile = () => {

  const { setUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImage: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();

      if (res.success) {
        setFormData({
          name: res.user.name,
          email: res.user.email,
          profileImage: res.user.profileImage || "",
        });
      }
    } catch (error) {
      toast.error("Unable to load profile");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setSelectedImage(file);

    // Show the selected image immediately
    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      profileImage: previewUrl,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const data = new FormData();

    data.append("name", formData.name);

    if (selectedImage) {
      data.append("profileImage", selectedImage);
    }

    const res = await updateProfile(data);

    if (res.success) {

      // Update AuthContext
      setUser(res.user);

      // Update localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(res.user)
      );

      // Update profile page with permanent URL
      setFormData({
        name: res.user.name,
        email: res.user.email,
        profileImage: res.user.profileImage || "",
      });

      // Remove temporary selected file
      setSelectedImage(null);

      toast.success(
        "Profile updated successfully"
      );
    }

  } catch (error) {

    console.error(
      "Profile update error:",
      error
    );

    toast.error(
      error.response?.data?.message ||
      "Profile update failed"
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-top">

          <div className="avatar-container">

            <img
              src={formData.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Profile"
              className="avatar-image"
            />

            <input
              type="file"
              accept="image/*"
              id="profileImage"
              hidden
              onChange={handleImageChange}
            />

            <label
              htmlFor="profileImage"
              className="edit-photo-icon"
            >
              <FiEdit2 />
            </label>

          </div>

          <h2>{formData.name}</h2>

          <p>{formData.email}</p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
            />
          </div>

          <button
            className="update-btn"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Profile"}
          </button>

        </form>

        <div className="security-card">

          <h3>Security</h3>

          <p>
            Keep your account secure by updating your
            password regularly.
          </p>

          <Link
            to="/change-password"
            className="password-btn"
          >
            Change Password →
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Profile;