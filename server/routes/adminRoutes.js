const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllPropertiesAdmin,
  reviewProperty,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllBookingsAdmin,
} = require('../controllers/adminController');
const { deleteProperty } = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require Admin role
router.use(protect, authorize('Admin'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/properties', getAllPropertiesAdmin);
router.patch('/properties/:id/review', reviewProperty);
router.delete('/properties/:id', deleteProperty);

router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

router.get('/bookings', getAllBookingsAdmin);

module.exports = router;
