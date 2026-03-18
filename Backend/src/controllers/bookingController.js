const Booking = require("../models/Booking");
const Court = require("../models/Court");

const calculateDate = (date, hours) => {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d;
};

const createRecurringBookings = async (booking, recurringRule) => {
  const { frequency, interval, endDate } = recurringRule;
  const recurringBookingIds = [];
  let currentDate = new Date(booking.startDate);

  while (currentDate <= new Date(endDate)) {
    if (currentDate.getTime() !== booking.startDate.getTime()) {
      const newBooking = new Booking({
        customerId: booking.customerId,
        courtId: booking.courtId,
        adminId: booking.adminId,
        bookingType: "recurring",
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        startDate: new Date(currentDate),
        endDate: calculateDate(currentDate, booking.durationHours),
        startTime: booking.startTime,
        endTime: booking.endTime,
        durationHours: booking.durationHours,
        courtPrice: booking.courtPrice,
        totalPrice: booking.totalPrice,
        paymentMethod: booking.paymentMethod,
        status: "CONFIRMED",
      });

      await newBooking.save();
      recurringBookingIds.push(newBooking._id);
    }

    if (frequency === "weekly") {
      currentDate.setDate(currentDate.getDate() + 7);
    } else if (frequency === "biweekly") {
      currentDate.setDate(currentDate.getDate() + 14);
    } else if (frequency === "monthly") {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }

  return recurringBookingIds;
};

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

const getCustomerBookings = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    let filter = { customerId: req.userId };

    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(filter)
      .populate("courtId", "name address")
      .sort({ startDate: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("courtId")
      .populate("customerId", "name phone email");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (
      booking.customerId._id.toString() !== req.userId &&
      booking.adminId.toString() !== req.userId
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const addDrinkToBooking = async (req, res) => {
  try {
    const { drinkId, quantity } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.adminId.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const drink = await Drink.findById(drinkId);
    if (!drink) {
      return res.status(404).json({ error: "Drink not found" });
    }

    if (drink.quantity < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    const drinkPrice = drink.price * quantity;

    booking.drinkItems.push({
      drinkId,
      name: drink.name,
      price: drink.price,
      quantity,
    });

    booking.totalDrinkPrice += drinkPrice;
    booking.totalPrice = booking.courtPrice + booking.totalDrinkPrice;

    drink.quantity -= quantity;
    await drink.save();

    await booking.save();

    res.json({
      message: "Drink added to booking",
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.adminId.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    booking.status = "COMPLETED";
    booking.completedAt = new Date();
    await booking.save();

    const revenue = new Revenue({
      bookingId: booking._id,
      adminId: booking.adminId,
      courtId: booking.courtId,
      courtRevenue: booking.courtPrice,
      drinkRevenue: booking.totalDrinkPrice,
      totalRevenue: booking.totalPrice,
      date: new Date(),
    });

    await revenue.save();

    res.json({
      message: "Booking completed",
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminBookings = async (req, res) => {
  try {
    if (req.params.adminId !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { status, startDate, endDate, courtId } = req.query;

    let filter = { adminId: req.userId };

    if (status) filter.status = status;
    if (courtId) filter.courtId = courtId;
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(filter)
      .populate("courtId", "name")
      .populate("customerId", "name phone email")
      .sort({ startDate: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const isCustomer = booking.customerId.toString() === req.userId;
    const isAdmin = booking.adminId.toString() === req.userId;

    if (!isCustomer && !isAdmin) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (booking.drinkItems.length > 0) {
      for (const item of booking.drinkItems) {
        const drink = await Drink.findById(item.drinkId);
        if (drink) {
          drink.quantity += item.quantity;
          await drink.save();
        }
      }
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.adminId.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { startTime, endTime, durationHours, drinkUpdates } = req.body;

    if (startTime) booking.startTime = startTime;
    if (endTime) booking.endTime = endTime;

    if (durationHours) {
      booking.durationHours = durationHours;
      const court = await Court.findById(booking.courtId);
      booking.courtPrice = court.pricePerHour * durationHours;
    }

    if (drinkUpdates && Array.isArray(drinkUpdates)) {
      let newTotalDrinkPrice = 0;

      for (const update of drinkUpdates) {
        const { drinkId, quantity, action } = update;

        if (action === "add") {
          const drink = await Drink.findById(drinkId);
          if (!drink) {
            return res
              .status(404)
              .json({ error: `Drink ${drinkId} not found` });
          }

          if (drink.quantity < quantity) {
            return res.status(400).json({ error: "Insufficient stock" });
          }

          const existingItem = booking.drinkItems.find(
            (item) => item.drinkId.toString() === drinkId,
          );

          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            booking.drinkItems.push({
              drinkId,
              name: drink.name,
              price: drink.price,
              quantity,
            });
          }

          drink.quantity -= quantity;
          await drink.save();
        } else if (action === "remove") {
          const existingItem = booking.drinkItems.find(
            (item) => item.drinkId.toString() === drinkId,
          );

          if (existingItem) {
            const drink = await Drink.findById(drinkId);
            if (drink) {
              drink.quantity += existingItem.quantity;
              await drink.save();
            }

            booking.drinkItems = booking.drinkItems.filter(
              (item) => item.drinkId.toString() !== drinkId,
            );
          }
        }
      }

      booking.totalDrinkPrice = booking.drinkItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    }

    booking.totalPrice = booking.courtPrice + booking.totalDrinkPrice;
    await booking.save();

    res.json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.adminId.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (booking.status !== "PENDING_APPROVAL") {
      return res
        .status(400)
        .json({ error: "Booking cannot be approved in current status" });
    }

    booking.status = "CONFIRMED";
    booking.approvedAt = new Date();
    await booking.save();

    res.json({
      message: "Booking approved successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.adminId.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (booking.status !== "PENDING_APPROVAL") {
      return res
        .status(400)
        .json({ error: "Booking cannot be rejected in current status" });
    }

    if (booking.drinkItems.length > 0) {
      for (const item of booking.drinkItems) {
        const drink = await Drink.findById(item.drinkId);
        if (drink) {
          drink.quantity += item.quantity;
          await drink.save();
        }
      }
    }

    booking.status = "CANCELLED";
    booking.rejectedAt = new Date();
    await booking.save();

    res.json({
      message: "Booking rejected successfully",
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

