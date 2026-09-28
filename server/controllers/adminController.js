const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

// @desc    Get comprehensive system metrics & stats for Admin Dashboard
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const tenantsCount = await User.countDocuments({ role: 'Tenant' });
    const ownersCount = await User.countDocuments({ role: 'Property Owner' });
    const adminsCount = await User.countDocuments({ role: 'Admin' });

    const totalProperties = await Property.countDocuments();
    const pendingProperties = await Property.countDocuments({ approvalStatus: 'Pending' });
    const approvedProperties = await Property.countDocuments({ approvalStatus: 'Approved' });
    const rejectedProperties = await Property.countDocuments({ approvalStatus: 'Rejected' });

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
    const approvedBookings = await Booking.countDocuments({ status: 'Approved' });
    const rejectedBookings = await Booking.countDocuments({ status: 'Rejected' });

    const recentBookings = await Booking.find()
      .populate('tenant', 'name email')
      .populate('property', 'title location rent')
      .sort({ createdAt: -1 })
      .limit(5);

    const pendingReviewList = await Property.find({ approvalStatus: 'Pending' })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          tenants: tenantsCount,
          owners: ownersCount,
          admins: adminsCount,
        },
        properties: {
          total: totalProperties,
          pending: pendingProperties,
          approved: approvedProperties,
          rejected: rejectedProperties,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          approved: approvedBookings,
          rejected: rejectedBookings,
        },
      },
      recentBookings,
      pendingReviewList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties (with status filter) for admin management
// @route   GET /api/admin/properties
// @access  Private (Admin only)
exports.getAllPropertiesAdmin = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.approvalStatus = status;
    }

    const pageNumber = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, parseInt(limit));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Review property listing (Approve or Reject with feedback)
// @route   PATCH /api/admin/properties/:id/review
// @access  Private (Admin only)
exports.reviewProperty = async (req, res, next) => {
  try {
    const { approvalStatus, adminFeedback } = req.body;

    if (!['Approved', 'Rejected'].includes(approvalStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either Approved or Rejected',
      });
    }

    const property = await Property.findById(req.params.id).populate('owner', 'name email');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    property.approvalStatus = approvalStatus;
    if (adminFeedback !== undefined) {
      property.adminFeedback = adminFeedback;
    }

    await property.save();

    res.status(200).json({
      success: true,
      message: `Property listing '${property.title}' has been ${approvalStatus.toLowerCase()}`,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users for user management
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = {};
    if (role && role !== 'All') {
      query.role = role;
    }

    const users = await User.find(query).sort({ createdAt: -1 }).select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private (Admin only)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['Tenant', 'Property Owner', 'Admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role provided',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user by Admin
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account',
      });
    }

    // Cascade delete properties and bookings if owner or tenant
    if (user.role === 'Property Owner') {
      await Property.deleteMany({ owner: user._id });
      await Booking.deleteMany({ owner: user._id });
    } else if (user.role === 'Tenant') {
      await Booking.deleteMany({ tenant: user._id });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User and all related records removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings across system
// @route   GET /api/admin/bookings
// @access  Private (Admin only)
exports.getAllBookingsAdmin = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('property', 'title location rent images address')
      .populate('tenant', 'name email phone')
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
