import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WalletCard from "../components/walletCard";
import "../styles/profile.css";
import axios from "axios";
import Navbar from "../components/Navbar";

function ProfilePage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_CUSTOMER_API_BASE_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const { name, email, phone, isAnonymous } = res.data.data;
        setName(name);
        setEmail(email);
        setPhone(phone);
        setIsAnonymous(isAnonymous);
        localStorage.setItem("loggedInUser", JSON.stringify(res.data.data));
      } catch (error) {
        alert("Error loading profile. Please login again.");
        navigate("/login-user");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_CUSTOMER_API_BASE_URL}/api/users/update-profile`,
        {
          name,
          email,
          phone,
          isAnonymous,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.setItem("loggedInUser", JSON.stringify(res.data.data));
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile.");
    }
  };

  if (loading) return <div className="profile-container">Loading...</div>;

  return (
    <>
      <Navbar />

      <div className="profile-container">
        <h2>Edit Profile</h2>
        <div className="profile-main">
          <div className="profile-card">
            <label>Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Full Name"
              type="text"
            />

            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              type="email"
            />

            <label>Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              type="tel"
            />

            <label className="anon-checkbox-label">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              Make my profile anonymous
            </label>

            <div className="profile-actions">
              <button onClick={handleSave}>Save Changes</button>
            </div>
          </div>

          {/* Wallet Card */}
          <div className="profile-wallet-section">
            <WalletCard />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
