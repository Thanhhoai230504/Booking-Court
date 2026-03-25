const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  validateCreateBooking,
  validateAddDrink,
  validateUpdateBooking,
} = require('../validators/bookingValidator');
const {
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
} = require('../controllers/bookingController');

const router = express.Router();


router.get('/court/:courtId/schedule', getCourtSchedule);

router.post('/', auth, validate(validateCreateBooking), createBooking);
router.get('/', auth, getCustomerBookings);
router.get('/:id', auth, getBookingById);
router.delete('/:id', auth, deleteBooking);
router.put('/:id', adminAuth, validate(validateUpdateBooking), updateBooking);
router.post('/:id/add-drink', adminAuth, validate(validateAddDrink), addDrinkToBooking);
router.post('/:id/approve', adminAuth, approveBooking);
router.post('/:id/reject', adminAuth, rejectBooking);
router.post('/:id/complete', adminAuth, completeBooking);
router.get('/admin/:adminId/bookings', adminAuth, getAdminBookings);

module.exports = router;
