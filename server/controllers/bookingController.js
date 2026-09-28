const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc    Create a new booking request
// @route   POST /api/bookings
// @access  Private (Tenant)
exports.createBooking = async (req, res, next) => {
  try {
    const { propertyId, moveInDate, message } = req.body;

    if (!propertyId || !moveInDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property ID and intended move-in date',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Property must be approved and available
    if (property.approvalStatus !== 'Approved' || !property.availability) {
      return res.status(400).json({
        success: false,
        message: 'This property is not currently open for bookings',
      });
    }

    // Prevent owner from booking their own property
    if (property.owner.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book your own property',
      });
    }

    // Check if tenant already has an active pending or approved booking for this property
    const existingBooking = await Booking.findOne({
      tenant: req.user.id,
      property: propertyId,
      status: { $in: ['Pending', 'Approved'] },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: `You already have an active ${existingBooking.status.toLowerCase()} booking request for this property`,
      });
    }

    const booking = await Booking.create({
      tenant: req.user.id,
      property: propertyId,
      owner: property.owner,
      moveInDate: new Date(moveInDate),
      message: message || '',
      status: 'Pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('property', 'title location rent images address')
      .populate('owner', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Rental booking request submitted successfully! Awaiting owner response.',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for logged-in tenant
// @route   GET /api/bookings/my-bookings
// @access  Private (Tenant)
exports.getTenantBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ tenant: req.user.id })
      .populate('property', 'title location rent images address propertyType availability')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all booking requests for properties owned by logged-in owner
// @route   GET /api/bookings/owner-requests
// @access  Private (Property Owner)
exports.getOwnerBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ owner: req.user.id })
      .populate('property', 'title location rent images address')
      .populate('tenant', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking request status (Approve or Reject by Owner)
// @route   PATCH /api/bookings/:id/status
// @access  Private (Property Owner)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, ownerNotes } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either Approved or Rejected',
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking request not found',
      });
    }

    // Verify that the logged-in user is the owner of this property
    if (booking.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update status for this booking',
      });
    }

    booking.status = status;
    if (ownerNotes !== undefined) {
      booking.ownerNotes = ownerNotes;
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('property', 'title location rent')
      .populate('tenant', 'name email phone');

    res.status(200).json({
      success: true,
      message: `Booking request has been ${status.toLowerCase()} successfully`,
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking request (by Tenant)
// @route   PATCH /api/bookings/:id/cancel
// @access  Private (Tenant)
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify that the logged-in user is the tenant
    if (booking.tenant.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking request',
      });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled',
      });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking request cancelled successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};
