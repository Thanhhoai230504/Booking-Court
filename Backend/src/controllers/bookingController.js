const Booking = require("../models/Booking");
const Court = require("../models/Court");


const checkAvailability = async (req, res) => {
  try {
    const { courtId, date, startTime, endTime } = req.query;

    if (!courtId || !date || !startTime || !endTime) {
      return res.status(400).json({
        error: "courtId, date, startTime, endTime là bắt buộc",
      });
    }

    const queryDate = new Date(date);
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

    const conflictingBookings = await Booking.find({
      courtId,
      status: { $nin: ["CANCELLED"] },
      startDate: { $gte: startOfDay, $lte: endOfDay },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (conflictingBookings.length > 0) {
      return res.json({
        available: false,
        message: "Sân đã được đặt trong khung giờ này",
        conflictingBookings: conflictingBookings.map((b) => ({
          bookingNumber: b.bookingNumber,
          startTime: b.startTime,
          endTime: b.endTime,
          status: b.status,
        })),
      });
    }

    res.json({
      available: true,
      message: "Sân còn trống trong khung giờ này",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const {
      courtId,
      startDate,
      startTime,
      endTime,
      durationHours,
      customerName,
      customerPhone,
      bookingType = "single",
      recurringRule,
      paymentMethod = "online",
      paymentProof,
    } = req.body;

    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({ error: "Court not found" });
    }

    // Kiểm tra trùng lịch trước khi tạo booking
    const queryDate = new Date(startDate);
    const startOfDay = new Date(new Date(queryDate).setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date(queryDate).setHours(23, 59, 59, 999));

    const conflictingBookings = await Booking.find({
      courtId,
      status: { $nin: ["CANCELLED"] },
      startDate: { $gte: startOfDay, $lte: endOfDay },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (conflictingBookings.length > 0) {
      return res.status(409).json({
        error: "Sân đã được đặt trong khung giờ này",
        conflictingBookings: conflictingBookings.map((b) => ({
          bookingNumber: b.bookingNumber,
          startTime: b.startTime,
          endTime: b.endTime,
          status: b.status,
        })),
      });
    }

    const endDateTime = calculateDate(startDate, durationHours);

    const booking = new Booking({
      customerId: req.userId,
      courtId,
      adminId: court.adminId,
      bookingType,
      customerName,
      customerPhone,
      startDate: new Date(startDate),
      endDate: endDateTime,
      startTime,
      endTime,
      durationHours,
      courtPrice: court.pricePerHour * durationHours,
      totalPrice: court.pricePerHour * durationHours,
      paymentMethod,
      paymentProof,
      status: "PENDING_APPROVAL",
    });

    await booking.save();

    if (bookingType === "recurring" && recurringRule) {
      const recurringBookingIds = await createRecurringBookings(
        booking,
        recurringRule,
      );
      booking.recurringRule = {
        ...recurringRule,
        recurringBookingIds,
      };
      await booking.save();
    }

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createBooking,
  checkAvailability,   // ← thêm dòng này
  getCustomerBookings,
  getBookingById,
  addDrinkToBooking,
  completeBooking,
  getAdminBookings,
  deleteBooking,
  updateBooking,
  approveBooking,
  rejectBooking,
};
module.exports = {
  createBooking,
  checkAvailability
};
