const express = require('express');
const { auth, ownerAuth } = require('../middleware/auth');
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
router.put('/:id', ownerAuth, validate(validateUpdateBooking), updateBooking);
router.post('/:id/add-drink', ownerAuth, validate(validateAddDrink), addDrinkToBooking);
router.post('/:id/approve', ownerAuth, approveBooking);
router.post('/:id/reject', ownerAuth, rejectBooking);
router.post('/:id/complete', ownerAuth, completeBooking);router.get('/admin/:adminId/bookings', ownerAuth, getAdminBookings);

module.exports = router;
