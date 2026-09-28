const express = require('express');
const router = express.Router();
const {
  getPublicProperties,
  getPropertyById,
  getOwnerProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleAvailability,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPublicProperties);

// Owner specific route (must come before /:id)
router.get(
  '/owner/my-properties',
  protect,
  authorize('Property Owner', 'Admin'),
  getOwnerProperties
);

router.get('/:id', getPropertyById);

// Owner property CRUD
router.post(
  '/',
  protect,
  authorize('Property Owner', 'Admin'),
  createProperty
);

router.put(
  '/:id',
  protect,
  authorize('Property Owner', 'Admin'),
  updateProperty
);

router.delete(
  '/:id',
  protect,
  authorize('Property Owner', 'Admin'),
  deleteProperty
);

router.patch(
  '/:id/availability',
  protect,
  authorize('Property Owner', 'Admin'),
  toggleAvailability
);

module.exports = router;
