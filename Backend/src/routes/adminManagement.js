const express = require('express');
const { adminAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { validateCreateOwner } = require('../validators/adminManagementValidator');
const {
  createOwner,
  getAllOwners,
  getAllCustomers,
  getOwnerById,
  toggleUserStatus,
  deleteUser,
  getSystemDashboard,
} = require('../controllers/adminManagementController');

const router = express.Router();

// Tất cả route đều yêu cầu quyền admin
router.get('/dashboard', adminAuth, getSystemDashboard);
router.post('/owners', adminAuth, validate(validateCreateOwner), createOwner);
router.get('/owners', adminAuth, getAllOwners);
router.get('/customers', adminAuth, getAllCustomers);
router.get('/owners/:id', adminAuth, getOwnerById);
router.post('/users/:id/toggle-status', adminAuth, toggleUserStatus);
router.delete('/users/:id', adminAuth, deleteUser);

module.exports = router;
