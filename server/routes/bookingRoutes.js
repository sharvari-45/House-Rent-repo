const express = require('express');
const router = express.Router();
const {
  createBooking,
  getTenantBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Tenant routes
router.post(
  '/',
  protect,
  authorize('Tenant', 'Admin'),
  createBooking
);

router.get(
  '/my-bookings',
  protect,
  authorize('Tenant', 'Admin'),
  getTenantBookings
);

router.patch(
  '/:id/cancel',
  protect,
  authorize('Tenant', 'Admin'),
  cancelBooking
);

// Owner routes
router.get(
  '/owner-requests',
  protect,
  authorize('Property Owner', 'Admin'),
  getOwnerBookings
);

router.patch(
  '/:id/status',
  protect,
  authorize('Property Owner', 'Admin'),
  updateBookingStatus
);

module.exports = router;
