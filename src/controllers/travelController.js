import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import axios from "axios";

import { travelOptions } from "../db.js";

export const getTravelOptions = async (req, res) => {
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
    travelOptions.length = 0; // Clear existing entries
    travelOptions.push(...response.data["travelOptions"]); // Append new data
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching travel options:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch travel options" });
  }
};
