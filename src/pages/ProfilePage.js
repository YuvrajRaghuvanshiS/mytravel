import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WalletCard from "../components/walletCard";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../styles/profile.css";

function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState("");
  const [saving, setSaving] = useState(false);

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // User specific fields
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Agency-specific fields
  const [gstNumber, setGstNumber] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [address, setAddress] = useState("");
  const [agencyType, setAgencyType] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let baseApiUrl = "";
        let type = "";

        const token = localStorage.getItem("token");

        // Try to detect from localStorage or fallback to user API
        const parsed = JSON.parse(localStorage.getItem("userType"));
        if (parsed.userType === "agencies") {
          baseApiUrl = process.env.REACT_APP_TRAVEL_AGENCY_API_BASE_URL;
          type = "agencies";
        } else {
          baseApiUrl = process.env.REACT_APP_CUSTOMER_API_BASE_URL;
          type = "users";
        }

        setUserType(type);

        const profileResp = await axios.get(`${baseApiUrl}/api/${type}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profileData = profileResp.data.data;
        setName(profileData.name);
        setEmail(profileData.email);
        setPhone(profileData.phone);

        if (type === "users") {
          setIsAnonymous(profileData.isAnonymous);
        } else if (type === "agencies") {
          setGstNumber(profileData.gstNumber || "");
          setContactPerson(profileData.contactPerson || "");
          setAddress(profileData.address || "");
          setAgencyType(profileData.agencyType || "");
        }
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
    setSaving(true);
    try {
      let baseApiUrl = "";
      let payload = {};

      const token = localStorage.getItem("token");
      if (userType === "agencies") {
        baseApiUrl = process.env.REACT_APP_TRAVEL_AGENCY_API_BASE_URL;

        // FIXME: See what fields can be updated.
        payload = {
          name: name,
          gstNumber: gstNumber,
          contactPerson: contactPerson,
          address: address,
          agencyType: agencyType,
        };
      } else {
        baseApiUrl = process.env.REACT_APP_CUSTOMER_API_BASE_URL;

        payload = {
          name: name,
          email: email,
          phone: phone,
          isAnonymous: isAnonymous,
        };
      }
      const res = await axios.put(
        `${baseApiUrl}/api/${userType}/update-profile`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.setItem("loggedInUser", JSON.stringify(res.data.data));
      localStorage.setItem("userType", JSON.stringify({ userType }));
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div className="profile-container">Loading...</div>
      </>
    );

  return (
    <>
      <Navbar />

      <div className="profile-container">
        <h2>Edit Profile</h2>
        <div className="profile-main">
          <div className="profile-card">
            <label>
              {userType === "agencies" ? "Agency Name" : "Full Name"}
            </label>
            <input
              name="name"
              value={name}
              onChange={(n) => setName(n.target.value)}
              placeholder={
                userType === "agencies"
                  ? "Enter agency name"
                  : "Enter full name"
              }
              type="text"
              required
            />

            <label>{userType === "agencies" ? "Agency Email" : "Email"}</label>
            <input
              name="email"
              value={email}
              readOnly
              className="profile-readonly"
              type="email"
            />

            <label>
              {userType === "agencies" ? "Agency Phone" : "Phone Number"}
            </label>
            <input
              name="phone"
              value={phone}
              readOnly
              className="profile-readonly"
              type="tel"
            />

            {/* User-specific fields */}
            {userType === "users" && (
              <label className="anon-checkbox-label">
                <input
                  type="checkbox"
                  checked={!!isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                Make my profile anonymous
              </label>
            )}

            {/* Agency-specific fields */}
            {userType === "agencies" && (
              <>
                <label>GST Number</label>
                <input
                  name="gstNumber"
                  value={gstNumber}
                  readOnly
                  className="profile-readonly"
                  type="text"
                />

                <label>Contact Person</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Enter contact person name"
                  required
                />

                <label>Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter agency address"
                  required
                  rows={2}
                  className="profile-textarea"
                />

                <label>Agency Type</label>
                <select
                  value={agencyType}
                  onChange={(e) => setAgencyType(e.target.value)}
                  required
                  className="profile-select"
                >
                  <option value="">Select type</option>
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </>
            )}

            <div className="profile-actions">
              <button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="profile-wallet-section">
            <WalletCard userType={userType} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
