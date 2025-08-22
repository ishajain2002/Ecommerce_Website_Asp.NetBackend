import React, { useEffect, useState } from "react";
import { fetchCurrentUser, updateUserProfile } from "../api/userApi";

export default function ProfilePage() {
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchCurrentUser(token);
        setProfile(data);
        setFormData(data);
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await updateUserProfile(token, formData);
      // ✅ Updated success message
      setMessage("Profile updated successfully");
      setProfile({ ...profile, ...formData });
      setEditMode(false);
    } catch (err) {
      console.error("Update failed", err);
      setMessage("Error updating profile");
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading profile...</p>;
  if (!profile) return <p style={{ padding: "20px" }}>No profile found.</p>;

  return (
    <div
      style={{
        padding: "32px 16px",
        maxWidth: "510px",
        margin: "40px auto",
        background: "#f7fafd",
        borderRadius: "16px",
        boxShadow: "0 8px 28px #eaf1fa",
      }}
    >
      <h2
        style={{
          fontSize: "2em",
          fontWeight: "bold",
          marginBottom: "16px",
          color: "#2563eb",
          letterSpacing: "1.5px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        👤 My Profile
      </h2>

      {message && (
        <p
          style={{
            color: message.includes("Error") ? "red" : "#168400",
            fontWeight: 500,
            marginBottom: "14px",
          }}
        >
          {message}
        </p>
      )}

      <div
        style={{
          border: "1px solid #e2e8f0",
          background: "#fdfeff",
          borderRadius: "8px",
          padding: "24px 22px",
        }}
      >
        {editMode ? (
          <>
            {/* Username */}
            <label
              style={{
                fontWeight: 500,
                marginBottom: 5,
                display: "block",
                color: "#1461b6",
              }}
            >
              Username:
            </label>
            <input
              type="text"
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "5px",
                border: "1px solid #d6dde6",
                marginBottom: "18px",
                fontSize: "1em",
                background: "#f8fafc",
              }}
            />

            {/* Email */}
            <label
              style={{
                fontWeight: 500,
                marginBottom: 5,
                display: "block",
                color: "#1461b6",
              }}
            >
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "5px",
                border: "1px solid #d6dde6",
                marginBottom: "18px",
                fontSize: "1em",
                background: "#f8fafc",
              }}
            />

            {/* Action Buttons */}
            <button
              onClick={handleUpdate}
              style={{
                padding: "7px 22px",
                borderRadius: "5px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 500,
                fontSize: "1em",
                marginRight: "12px",
                marginTop: "10px",
                boxShadow: "0 1px 7px #eaf1fa",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              style={{
                padding: "7px 22px",
                borderRadius: "5px",
                border: "none",
                background: "#e1e7ef",
                color: "#222",
                fontWeight: 500,
                fontSize: "1em",
                marginTop: "10px",
                boxShadow: "0 1px 7px #eaf1fa",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <p style={{ fontSize: "1.06em", margin: "9px 0" }}>
              <strong>Username:</strong> {profile.username}
            </p>
            <p style={{ fontSize: "1.06em", margin: "9px 0" }}>
              <strong>Email:</strong> {profile.email}
            </p>
            <p style={{ fontSize: "1.06em", margin: "9px 0" }}>
              <strong>Loyalty Points:</strong> {profile.loyaltyPoints}
            </p>

            <button
              onClick={() => setEditMode(true)}
              style={{
                padding: "7px 22px",
                borderRadius: "5px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 500,
                fontSize: "1em",
                marginTop: "10px",
                boxShadow: "0 1px 7px #eaf1fa",
                cursor: "pointer",
              }}
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}