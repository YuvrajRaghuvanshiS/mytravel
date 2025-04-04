const { users } = require("../db");

exports.getCustomerInfo = (req, res) => {
  const userId = req.user.id;
  console.log("User ID:", userId);
  console.log(users);
  const user = users[userId];

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
};
