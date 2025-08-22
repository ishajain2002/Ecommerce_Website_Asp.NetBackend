// src/api/userApi.js
const API_BASE = "http://localhost:5087/api/user";

// Fetch current logged-in user's profile
export async function fetchCurrentUser(token) {
  const res = await fetch(`${API_BASE}/me`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Error fetching user: ${res.status}`);
  }
  return await res.json();
}

// Update current logged-in user's profile
export async function updateUserProfile(token, updateData) {
  const res = await fetch(`${API_BASE}/updateuser`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) {
    throw new Error(`Error updating profile: ${res.status}`);
  }
  return await res.text(); // backend sends a String message
}