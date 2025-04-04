require("dotenv").config();
const axios = require("axios");

exports.getTravelOptions = async (req, res) => {
  try {
    const {
      date,
      source,
      destination,
      type,
      minPrice,
      maxPrice,
      availableOnly,
      sortBy,
    } = req.query;

    // Call the Travel Agency Backend
    console.log(
      `${process.env.TRAVEL_AGENCY_BACKEND_URL}/api/travel/public-list`
    );
    const response = await axios.get(
      `${process.env.TRAVEL_AGENCY_BACKEND_URL}/api/travel/public-list`,
      {
        params: {
          date,
          source,
          destination,
          type,
          minPrice,
          maxPrice,
          availableOnly,
          sortBy,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching travel options:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch travel options" });
  }
};
