// src/components/WalletCard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/wallet-card.css";

function WalletCard({ showBack, onBack, afterAdd }) {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_CUSTOMER_API_BASE_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const { balance } = res.data.data;
        setBalance(balance);
        localStorage.setItem("walletBalance", balance);
      } catch (error) {
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  const handleAddMoney = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_CUSTOMER_API_BASE_URL}/api/wallet/add-money`,
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
      setAmount("");
      localStorage.setItem("walletBalance", newBalance);

      const userData = JSON.parse(localStorage.getItem("loggedInUser"));
      if (userData) {
        userData.balance = newBalance;
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
      }

      alert("Money added to wallet!");
      if (afterAdd) afterAdd(newBalance);
    } catch (error) {
      const serverMsg = error?.response?.data?.message;
      alert(
        serverMsg || "Error adding money to wallet. Please try again later."
      );
    }
  };

  if (loading)
    return (
      <div className="wallet-card">
        <h2>My Wallet</h2>
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="wallet-card">
      <h2>My Wallet</h2>
      <p>
        <strong>Current Balance:</strong>{" "}
        <span className="wallet-balance">₹{balance.toFixed(2)}</span>
      </p>
      <div className="wallet-input-row">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
        />
        <button className="wallet-add-btn" onClick={handleAddMoney}>
          Add Money
        </button>
      </div>
      {showBack && (
        <button className="wallet-back-btn" onClick={onBack}>
          ← Back
        </button>
      )}
    </div>
  );
}

export default WalletCard;
