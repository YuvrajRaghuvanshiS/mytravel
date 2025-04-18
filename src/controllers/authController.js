const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/jwt");
const { agencies } = require("../db");

exports.register = async (req, res) => {
  const { id, name, email, phone, password } = req.body;
  if (!id || !name || !email || !phone || !password)
    return res.status(400).json({ success: false, message: "Missing fields" });

  if (agencies[id])
    return res
      .status(409)
      .json({ success: false, message: "Agency already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  agencies[id] = {
    id,
    name,
    email,
    phone,
    password: hashedPassword,
    balance: 0,
  };

  const token = signToken({ id, role: "agency" });
  res.status(201).json({ success: true, token });
};

exports.login = async (req, res) => {
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
