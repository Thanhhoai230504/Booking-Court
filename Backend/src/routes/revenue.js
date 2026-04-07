const express = require('express');
const { ownerAuth } = require('../middleware/auth');
const {
  getDashboard,
  getRevenueByDate,
  getRevenueByMonth,
  getRevenueByCourtController,
} = require('../controllers/revenueController');

const router = express.Router();

router.get('/admin/:adminId/dashboard', ownerAuth, getDashboard);
router.get('/admin/:adminId/revenue-by-date', ownerAuth, getRevenueByDate);
router.get('/admin/:adminId/revenue-by-month', ownerAuth, getRevenueByMonth);
router.get('/admin/:adminId/revenue-by-court', ownerAuth, getRevenueByCourtController);

module.exports = router;
