import { agencies, travelOptions } from "../db.js";

export const travelOptionsFilter = (
  agencyId,
  date,
  source,
  destination,
  type,
  minPrice,
  maxPrice,
  availableOnly,
  sortBy
) => {
  let agencyTravels = travelOptions;

  if (agencyId) {
    agencyTravels = travelOptions.filter(
      (option) => option.agencyId === agencyId
    );
  }

  // Apply filters if provided
  if (date) {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate)) {
      agencyTravels = agencyTravels.filter(
        (option) =>
          new Date(option.date).toISOString().split("T")[0] ===
          parsedDate.toISOString().split("T")[0]
      );
    }
  }

  if (source) {
    agencyTravels = agencyTravels.filter((option) =>
      option.source.toLowerCase().includes(source.toLowerCase())
    );
  }

  if (destination) {
    agencyTravels = agencyTravels.filter((option) =>
      option.destination.toLowerCase().includes(destination.toLowerCase())
    );
  }

  if (type) {
    agencyTravels = agencyTravels.filter(
      (option) => option.type.toLowerCase() === type.toLowerCase()
    );
  }

  if (minPrice) {
    agencyTravels = agencyTravels.filter(
      (option) => option.basePrice >= parseFloat(minPrice)
    );
  }

  if (maxPrice) {
    agencyTravels = agencyTravels.filter(
      (option) => option.basePrice <= parseFloat(maxPrice)
    );
  }

  if (availableOnly === "true") {
    agencyTravels = agencyTravels.filter((option) => option.availableSeats > 0);
  }

  // Sorting logic
  if (sortBy) {
    if (sortBy === "price") {
      agencyTravels.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === "departureTime") {
      agencyTravels.sort(
        (a, b) => new Date(a.departureTime) - new Date(b.departureTime)
      );
    } else if (sortBy === "ratings") {
      agencyTravels.sort((a, b) => {
        const aRatings = agencies[a.agencyId].rating;
        const bRatings = agencies[b.agencyId].rating;
        const aAvg =
          aRatings.totalRatings > 0
            ? aRatings.totalScore / aRatings.totalRatings
            : 0;
        const bAvg =
          bRatings.totalRatings > 0
            ? bRatings.totalScore / bRatings.totalRatings
            : 0;
        return bAvg - aAvg;
      });
    }
  }

  // Attach agency rating
  agencyTravels = agencyTravels.map((option) => {
    const agency = agencies[option.agencyId];
    let averageRating = null;

    if (agency && agency.rating && agency.rating.totalRatings > 0) {
      averageRating = agency.rating.totalScore / agency.rating.totalRatings;
    }

    return {
      ...option,
      agencyName: agency.name,
      agencyRating: averageRating,
      totalRatings: agency.rating.totalRatings,
    };
  });

  return agencyTravels;
};
