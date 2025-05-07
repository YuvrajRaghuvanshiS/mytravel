import { users } from "../db.js";

export const addMoneyToWallet = (req, res) => {
  const userId = req.user.id;

  const { amount } = req.body;

  if (amount === undefined)
    return res.status(400).json({ success: false, message: "Missing amount" });

  if (typeof amount !== "number" || amount <= 0)
    return res
      .status(400)
      .json({ success: false, message: "'amount' must be a positive number" });

  const user = users[userId];
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  user.balance = (user.balance || 0) + amount;

  res.status(200).json({
    success: true,
    message: `₹${amount} added to wallet successfully.`,
    balance: user.balance,
  });
};
