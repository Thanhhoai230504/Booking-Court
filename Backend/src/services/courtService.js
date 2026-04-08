const Court = require("../models/Court");
const { deleteFile } = require("../middleware/upload");
const path = require("path");

const getAvailableCourts = async (filters) => {
  const { city, maxPrice } = filters;

  let filter = { status: "active" };

  if (city) filter.city = city;
  if (maxPrice) filter.pricePerHour = { $lte: maxPrice };

  const courts = await Court.find(filter).select("-adminId");
  return courts;
};

const getCourtById = async (courtId) => {
  const court = await Court.findById(courtId).populate("adminId", "name phone");

  if (!court) {
    const error = new Error("Court not found");
    error.status = 404;
    throw error;
  }

  return court;
};

const createCourt = async (userId, courtData, imagePaths = []) => {
  const {
    name,
    address,
    city,
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
    images: imagePaths,
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

const updateCourt = async (
  courtId,
  userId,
  userRole,
  updateData,
  imagePaths = [],
) => {
  const court = await Court.findById(courtId);

  if (!court) {
    const error = new Error("Court not found");
    error.status = 404;
    throw error;
  }

  // Admin có thể sửa tất cả sân, owner chỉ sửa sân của mình
  if (userRole !== "admin" && court.adminId.toString() !== userId) {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
  }

  const allowedFields = [
    "name",
    "address",
    "city",
    "description",
    "totalCourts",
    "pricePerHour",
    "hourlyPricing",
    "openingHours",
    "status",
  ];
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      court[field] = updateData[field];
    }
  }

  // Nếu có upload ảnh mới
  if (imagePaths.length > 0) {
    // Xóa ảnh cũ trên disk
    if (court.images && court.images.length > 0) {
      court.images.forEach((img) => {
        if (img.startsWith("/uploads/")) {
          const filePath = path.join(__dirname, "..", "..", img);
          deleteFile(filePath);
        }
      });
    }
    court.images = imagePaths;
  }

  await court.save();

  return {
    message: "Court updated successfully",
    court,
  };
};

const getAdminCourts = async (adminId, userId, userRole) => {
  // Admin xem tất cả sân, owner chỉ xem sân của mình
  if (userRole === "admin") {
    const courts = await Court.find().populate("adminId", "name email phone");
    return courts;
  }

  if (adminId !== userId) {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
  }

  const courts = await Court.find({ adminId: userId });
  return courts;
};

const deleteCourt = async (courtId, userId, userRole) => {
  const court = await Court.findById(courtId);

  if (!court) {
    const error = new Error("Court not found");
    error.status = 404;
    throw error;
  }

  // Admin có thể xoá tất cả sân, owner chỉ xoá sân của mình
  if (userRole !== "admin" && court.adminId.toString() !== userId) {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
  }

  // Xóa ảnh trên disk
  if (court.images && court.images.length > 0) {
    court.images.forEach((img) => {
      if (img.startsWith("/uploads/")) {
        const filePath = path.join(__dirname, "..", "..", img);
        deleteFile(filePath);
      }
    });
  }

  await Court.findByIdAndDelete(courtId);

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
