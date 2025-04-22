import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/wallet.css";

function AgencyWalletPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await axios.get("http://localhost:3002/api/agencies/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const { balance } = res.data.data;
        setBalance(balance);
      } catch (error) {
        console.error("Failed to fetch agency wallet:", error);
        alert("Unable to load agency wallet.");
        navigate("/agency-login");
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
        "http://localhost:3002/api/wallet/add-money",
        { amount: Number(amount) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      alert("Money added to wallet!");
      navigate("/agency-dashboard");
    } catch (error) {
      const serverMsg = error?.response?.data?.message;
      alert(serverMsg || "Error adding money to wallet");
    }
  };

  if (loading) return <div className="wallet-container">Loading...</div>;

  return (
    <div className="wallet-container">
      <h2>Agency Wallet</h2>
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
  );
}

export default AgencyWalletPage;
