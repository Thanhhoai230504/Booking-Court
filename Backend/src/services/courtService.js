const Court = require("../models/Court");

const getAvailableCourts = async (filters) => {
  const { city, maxPrice } = filters;

  let filter = { status: "active" };

  if (city) filter.city = city;
  if (maxPrice) filter.pricePerHour = { $lte: maxPrice };

  const courts = await Court.find(filter).select("-adminId");

  return courts;
};

const getCourtById = async (courtId) => {
  const court = await Court.findById(courtId).populate(
    "adminId",
    "name phone",
  );

  if (!court) {
    const error = new Error("Court not found");
    error.status = 404;
    throw error;
  }

  return court;
};

const createCourt = async (userId, courtData) => {
  const {
    name,
    address,
    city,
    images,
    description,
    totalCourts,
    pricePerHour,
    hourlyPricing,
    openingHours,
  } = courtData;

  const court = new Court({
    name,
    address,
    city,
    images: images || [],
    description,
    totalCourts: totalCourts || 1,
    pricePerHour,
    hourlyPricing: hourlyPricing || [],
    openingHours: openingHours || { start: "06:00", end: "22:00" },
    adminId: userId,
  });

  await court.save();

  return {
    message: "Court created successfully",
    court,
  };
};

const updateCourt = async (courtId, userId, updateData) => {
  const court = await Court.findById(courtId);

  if (!court) {
    const error = new Error("Court not found");
    error.status = 404;
    throw error;
  }

  if (court.adminId.toString() !== userId) {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
  }

  Object.assign(court, updateData);
  await court.save();

  return {
    message: "Court updated successfully",
    court,
  };
};

const getAdminCourts = async (adminId, userId) => {
  if (adminId !== userId) {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
  }

  const courts = await Court.find({ adminId: userId });

  return courts;
};

const deleteCourt = async (courtId, userId) => {
  const court = await Court.findById(courtId);

  if (!court) {
    const error = new Error("Court not found");
    error.status = 404;
    throw error;
  }

  if (court.adminId.toString() !== userId) {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
  }

  await court.deleteOne();

  return { message: "Court deleted successfully" };
};

module.exports = {
  getAvailableCourts,
  getCourtById,
  createCourt,
  updateCourt,
  getAdminCourts,
  deleteCourt,
};
