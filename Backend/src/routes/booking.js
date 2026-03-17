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
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", auth, validate(createBookingValidation), createBooking);
router.get("/", auth, validate(getCustomerBookingsValidation), getCustomerBookings);
router.get("/check-available", auth, validate(checkAvailabilityValidation), checkAvailability);
router.get("/:id", auth, getBookingById);
router.delete("/:id", auth, deleteBooking);
router.put("/:id", adminAuth, updateBooking); 
router.post("/:id/add-drink", adminAuth, addDrinkToBooking);
router.post("/:id/approve", adminAuth, approveBooking);
router.post("/:id/reject", adminAuth, rejectBooking);
router.post("/:id/complete", adminAuth, completeBooking);
router.get("/admin/:adminId/bookings", adminAuth, getAdminBookings);

module.exports = router;
