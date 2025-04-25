// src/pages/UpdateAgencyProfile.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/agencyDashboard.css";

function UpdateAgencyProfile() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${process.env.TRAVEL_AGENCY_API_BASE_URL}/api/agencies/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { name, email, phone } = res.data.data;
      setFormData({ name, email, phone });
    } catch (err) {
      console.error("Failed to fetch agency profile", err);
      alert("Could not load profile data.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${process.env.TRAVEL_AGENCY_API_BASE_URL}/api/agencies/update-profile`,
        { name: formData.name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message || "Profile updated successfully!");
      navigate("/agency-dashboard");
    } catch (err) {
      console.error("Failed to update profile", err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="agency-dashboard">
      <div className="agency-profile">
        <h2>Update Profile</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email (not editable)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              style={{ backgroundColor: "#e9ecef", color: "#6c757d" }}
            />
          </div>

          <div className="form-group">
            <label>Phone (not editable)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              readOnly
              style={{ backgroundColor: "#e9ecef", color: "#6c757d" }}
            />
          </div>

          <button type="submit" className="green-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateAgencyProfile;
