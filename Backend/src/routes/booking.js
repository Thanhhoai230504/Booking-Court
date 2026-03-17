const express = require("express");
const { auth, adminAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createBookingValidation,
  checkAvailabilityValidation,
  getCustomerBookingsValidation,
} = require("../validators/bookingValidator");
const {
  createBooking,
  checkAvailability,
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", auth, createBookingValidation, validate, createBooking);
router.get(
  "/",
  auth,
  getCustomerBookingsValidation,
  validate,
  getCustomerBookings,
);
router.get(
  "/check-available",
  auth,
  checkAvailabilityValidation,
  validate,
  checkAvailability,
);
module.exports = router;
