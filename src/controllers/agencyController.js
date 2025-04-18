import { agencies } from "../db.js";

export const getAgencyInfo = (req, res) => {
  const agencyId = req.user.id;
  const agency = agencies[agencyId];

  if (!agency) {
    return res
      .status(404)
      .json({ success: false, message: "Agency not found" });
  }

  res.status(200).json({
    success: true,
    data: {
      id: agency.id,
      name: agency.name,
      email: agency.email,
      phone: agency.phone,
      balance: agency.balance,
    },
  });
};

export const updateAgencyProfile = async (req, res) => {
  const agencyId = req.user.id; // from JWT
  const { name, email, phone } = req.body;

  if (!agencies[agencyId]) {
    return res
      .status(404)
      .json({ success: false, message: "Agency not found" });
  }

  if (!name && !email && !phone) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one field to update",
    });
  }

  // Update fields if provided
  if (name) agencies[agencyId].name = name;
  if (email) agencies[agencyId].email = email;
  if (phone) agencies[agencyId].phone = phone;

  return res.status(200).json({
    success: true,
    message: "Agency profile updated successfully.",
    data: {
      id: agencies[agencyId].id,
      name: agencies[agencyId].name,
      email: agencies[agencyId].email,
      phone: agencies[agencyId].phone,
    },
  });
};
