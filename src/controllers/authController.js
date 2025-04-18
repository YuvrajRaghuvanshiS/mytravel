import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt.js";
import { users } from "../db.js";

export const register = async (req, res) => {
  const { id, name, email, phone, password } = req.body;
  if (!id || !name || !email || !phone || !password)
    return res.status(400).json({ success: false, message: "Missing fields" });

  if (users[id])
    return res
      .status(409)
      .json({ success: false, message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  users[id] = {
    id,
    name,
    email,
    phone,
    password: hashedPassword,
    isAnonymous: true,
  };

  const token = signToken({ id, role: "customer" });
  res.status(201).json({ success: true, token });
};

export const login = async (req, res) => {
  const { id, password } = req.body;
  const user = users[id];

  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res
      .status(401)
      .json({ success: false, message: "Incorrect password" });

  const token = signToken({ id, role: "customer" });
  res.status(200).json({ success: true, token });
};
