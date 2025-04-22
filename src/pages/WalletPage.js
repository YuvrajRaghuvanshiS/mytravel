// src/pages/WalletPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/wallet.css";

function WalletPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const { balance } = res.data.data;
        setBalance(balance);
        localStorage.setItem("walletBalance", balance);
      } catch (error) {
        console.error("Failed to fetch wallet info:", error);
        alert("Unable to load wallet info. Please login again.");
        navigate("/login-user");
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [navigate]);

  const handleAddMoney = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3001/api/wallet/add-money",
        { amount: Number(amount) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { success, message, balance: newBalance } = res.data;

      if (!success) {
        alert(message || "API returned failure");
        return;
      }

      setBalance(newBalance);
      setAmount(0);
      localStorage.setItem("walletBalance", newBalance);

      const userData = JSON.parse(localStorage.getItem("loggedInUser"));
      if (userData) {
        userData.balance = newBalance;
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
      }

      alert("Money added to wallet!");
      navigate("/flights");
    } catch (error) {
      const serverMsg = error?.response?.data?.message;
      console.error("Failed to add money:", serverMsg || error.message);
      alert(serverMsg || "Error adding money to wallet. Please try again later.");
    }
  };

  if (loading) return <div className="wallet-container">Loading...</div>;

  return (
    <div className="wallet-container">
      <div className="wallet-card">
        <h2>My Wallet</h2>
        <p><strong>Current Balance:</strong> ₹{balance.toFixed(2)}</p>
        <input
          type="number"
          placeholder="Enter amount to add"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
        />
        <div className="wallet-buttons">
          <button onClick={handleAddMoney}>Add Money</button>
          <button onClick={() => navigate(-1)}>← Back</button>
        </div>
      </div>
    </div>
  );
}

export default WalletPage;
