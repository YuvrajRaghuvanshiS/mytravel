const chaincodeInvoker = require("../services/chaincodeInvoker");

const customers = {}; // In-memory store for now

exports.registerCustomer = async (req, res) => {
  try {
    const { id, name, email, phone, publicInfo = {} } = req.body;

    if (!id || !name || !email || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Store customer info locally
    customers[id] = {
      id,
      name,
      email,
      phone,
      publicInfo,
    };

    // Call chaincode with relevant public info
    await chaincodeInvoker.invokeChaincode("RegisterCustomer", [
      id,
      name,
      JSON.stringify(publicInfo),
    ]);

    res
      .status(201)
      .json({
        success: true,
        message: "Customer registered",
        data: customers[id],
      });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCustomerInfo = (req, res) => {
  const id = req.params.id;
  const customer = customers[id];

  if (!customer) {
    return res
      .status(404)
      .json({ success: false, message: "Customer not found" });
  }

  // Don't return email/phone
  const { email, phone, ...safeInfo } = customer;
  res.status(200).json({ success: true, data: safeInfo });
};
