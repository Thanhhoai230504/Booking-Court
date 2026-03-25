const bookingService = require("../services/bookingService");

const createBooking = async (req, res) => {
  try {
    const result = await bookingService.createBooking(req.userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const getCustomerBookings = async (req, res) => {
  try {
    const result = await bookingService.getCustomerBookings(req.userId, req.query);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const result = await bookingService.getBookingById(req.params.id, req.userId);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const addDrinkToBooking = async (req, res) => {
  try {
    const result = await bookingService.addDrinkToBooking(req.params.id, req.userId, req.body);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const completeBooking = async (req, res) => {
  try {
    const result = await bookingService.completeBooking(req.params.id, req.userId);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const getAdminBookings = async (req, res) => {
  try {
    const result = await bookingService.getAdminBookings(req.params.adminId, req.userId, req.query);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const result = await bookingService.deleteBooking(req.params.id, req.userId);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const result = await bookingService.updateBooking(req.params.id, req.userId, req.body);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const approveBooking = async (req, res) => {
  try {
    const result = await bookingService.approveBooking(req.params.id, req.userId);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const rejectBooking = async (req, res) => {
  try {
    const result = await bookingService.rejectBooking(req.params.id, req.userId);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

const getCourtSchedule = async (req, res) => {
  try {
    const result = await bookingService.getCourtSchedule(req.params.courtId, req.query.date);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

module.exports = {
  createBooking,
  getCustomerBookings,
  getBookingById,
  addDrinkToBooking,
  completeBooking,
  getAdminBookings,
  deleteBooking,
  updateBooking,
  approveBooking,
  rejectBooking,
  getCourtSchedule,
};
