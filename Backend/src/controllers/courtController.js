const Court = require("../models/Court");

const getAvailableCourts = async (req, res) => {
  try {
    const { city, date, startTime, endTime, maxPrice } = req.query;

    let filter = { status: "active" };

    if (city) filter.city = city;
    if (maxPrice) filter.pricePerHour = { $lte: maxPrice };

    const courts = await Court.find(filter).select("-adminId");

    res.json(courts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCourtById = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id).populate(
      "adminId",
      "name phone",
    );

    if (!court) {
      return res.status(404).json({ error: "Court not found" });
    }

    res.json(court);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCourt = async (req, res) => {
  try {
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
    } = req.body;

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
      adminId: req.userId,
    });

    await court.save();

    res.status(201).json({
      message: "Court created successfully",
      court,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCourt = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);

    if (!court) {
      return res.status(404).json({ error: "Court not found" });
    }

    if (court.adminId.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    Object.assign(court, req.body);
    await court.save();

    res.json({
      message: "Court updated successfully",
      court,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminCourts = async (req, res) => {
  try {
    if (req.params.adminId !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const courts = await Court.find({ adminId: req.userId });

    res.json(courts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCourt = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);

    if (!court) {
      return res.status(404).json({ error: "Court not found" });
    }

    if (court.adminId.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await court.deleteOne();

    res.json({ message: "Court deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAvailableCourts,
  getCourtById,
  createCourt,
  updateCourt,
  getAdminCourts,
  deleteCourt,
};
