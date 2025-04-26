import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt.js";
import { agencies } from "../db.js";

export const register = async (req, res) => {
  const {
    id,
    name,
    email,
    phone,
    password,
    gstNumber,
    contactPerson,
    address,
    agencyType,
  } = req.body;

  if (
    !id ||
    !name ||
    !email ||
    !phone ||
    !password ||
    !gstNumber ||
    !contactPerson ||
    !address ||
    !agencyType
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  if (agencies[id]) {
    return res
      .status(409)
      .json({ success: false, message: "Agency already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  agencies[id] = {
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name,
    email,
    phone,
    password: hashedPassword,
    balance: 0,
    gstNumber,
    contactPerson,
    address,
    agencyType,
  };

  const token = signToken({ id, role: "agency" });

  return res.status(201).json({
    success: true,
    message: "Agency registered successfully",
    token,
  });
};

export const login = async (req, res) => {
  const { id, password } = req.body;
  const agency = agencies[id];

  if (!agency)
    return res
      .status(404)
      .json({ success: false, message: "Agency not found" });

  const match = await bcrypt.compare(password, agency.password);
  if (!match)
    return res
      .status(401)
      .json({ success: false, message: "Incorrect password" });

  const token = signToken({ id, role: "agency" });
  res.status(200).json({ success: true, token });
};
