const Booking = require("../models/Booking");
const Court = require("../models/Court");
// const Drink = require("../models/Drink");
// const Revenue = require("../models/Revenue");

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

const createBooking = async (userId, bookingData) => {
  const {
    courtId,
    courtNumber = 0,
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
  } = bookingData;

  const court = await Court.findById(courtId);
  if (!court) {
    const error = new Error("Court not found");
    error.status = 404;
    throw error;
  }

  const endDateTime = calculateDate(startDate, durationHours);

  const booking = new Booking({
    customerId: userId,
    courtId,
    courtNumber,
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

  return {
    message: "Booking created successfully",
    booking,
  };
};

const getCustomerBookings = async (userId, filters) => {
  const { status, startDate, endDate } = filters;

  let filter = { customerId: userId };

  if (status) filter.status = status;
  if (startDate || endDate) {
    filter.startDate = {};
    if (startDate) filter.startDate.$gte = new Date(startDate);
    if (endDate) filter.startDate.$lte = new Date(endDate);
  }

  const bookings = await Booking.find(filter)
    .populate("courtId", "name address")
    .sort({ startDate: -1 });

  return bookings;
};

const getBookingById = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId)
    .populate("courtId")
    .populate("customerId", "name phone email");

  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  if (
    booking.customerId._id.toString() !== userId &&
    booking.adminId.toString() !== userId
  ) {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
  }

  return booking;
};

const addDrinkToBooking = async (bookingId, userId, drinkData) => {
  const { drinkId, quantity } = drinkData;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  if (booking.adminId.toString() !== userId) {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
  }

  const drink = await Drink.findById(drinkId);
  if (!drink) {
    const error = new Error("Drink not found");
    error.status = 404;
    throw error;
  }

  if (drink.quantity < quantity) {
    const error = new Error("Insufficient stock");
    error.status = 400;
    throw error;
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

  return {
    message: "Drink added to booking",
    booking,
  };
};

const completeBooking = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  if (booking.adminId.toString() !== userId) {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
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

  return {
    message: "Booking completed",
    booking,
  };
};

const getAdminBookings = async (adminId, userId, filters) => {
  if (adminId !== userId) {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
  }

  const { status, startDate, endDate, courtId } = filters;

  let filter = { adminId: userId };

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

  return bookings;
};

const deleteBooking = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  const isCustomer = booking.customerId.toString() === userId;
  const isAdmin = booking.adminId.toString() === userId;

  if (!isCustomer && !isAdmin) {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
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

  await Booking.findByIdAndDelete(bookingId);

  return { message: "Booking deleted successfully" };
};

const updateBooking = async (bookingId, userId, updateData) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  if (booking.adminId.toString() !== userId) {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
  }

  const { startTime, endTime, durationHours, drinkUpdates } = updateData;

  if (startTime) booking.startTime = startTime;
  if (endTime) booking.endTime = endTime;

  if (durationHours) {
    booking.durationHours = durationHours;
    const court = await Court.findById(booking.courtId);
    booking.courtPrice = court.pricePerHour * durationHours;
  }

  if (drinkUpdates && Array.isArray(drinkUpdates)) {
    for (const update of drinkUpdates) {
      const { drinkId, quantity, action } = update;

      if (action === "add") {
        const drink = await Drink.findById(drinkId);
        if (!drink) {
          const error = new Error(`Drink ${drinkId} not found`);
          error.status = 404;
          throw error;
        }

        if (drink.quantity < quantity) {
          const error = new Error("Insufficient stock");
          error.status = 400;
          throw error;
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

  return {
    message: "Booking updated successfully",
    booking,
  };
};

const approveBooking = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  if (booking.adminId.toString() !== userId) {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
  }

  if (booking.status !== "PENDING_APPROVAL") {
    const error = new Error("Booking cannot be approved in current status");
    error.status = 400;
    throw error;
  }

  booking.status = "CONFIRMED";
  booking.approvedAt = new Date();
  await booking.save();

  return {
    message: "Booking approved successfully",
    booking,
  };
};

const rejectBooking = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  if (booking.adminId.toString() !== userId) {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
  }

  if (booking.status !== "PENDING_APPROVAL") {
    const error = new Error("Booking cannot be rejected in current status");
    error.status = 400;
    throw error;
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

  return {
    message: "Booking rejected successfully",
    booking,
  };
};

const getCourtSchedule = async (courtId, date) => {
  if (!date) {
    const error = new Error("Date query parameter is required");
    error.status = 400;
    throw error;
  }

  const startOfDay = new Date(date + "T00:00:00.000Z");
  const endOfDay = new Date(date + "T23:59:59.999Z");

  const bookings = await Booking.find({
    courtId,
    startDate: { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ["PENDING_APPROVAL", "CONFIRMED", "PLAYING"] },
  }).select("startTime endTime status courtNumber");

  return bookings;
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
