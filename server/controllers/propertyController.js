const Property = require('../models/Property');
const Booking = require('../models/Booking');

// @desc    Get all publicly visible properties (Approved & Available) with search & filters
// @route   GET /api/properties
// @access  Public
exports.getPublicProperties = async (req, res, next) => {
  try {
    const {
      search,
      location,
      minPrice,
      maxPrice,
      propertyType,
      bedrooms,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {
      approvalStatus: 'Approved',
      availability: true,
    };

    // Text / keyword search across title, description, location, address
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { address: searchRegex },
      ];
    }

    // Specific location filter
    if (location && location.trim() !== '') {
      query.location = new RegExp(location.trim(), 'i');
    }

    // Property Type filter
    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    // Bedrooms filter
    if (bedrooms && bedrooms !== 'All') {
      query.bedrooms = Number(bedrooms);
    }

    // Price range filters
    if (minPrice || maxPrice) {
      query.rent = {};
      if (minPrice) query.rent.$gte = Number(minPrice);
      if (maxPrice) query.rent.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: Newest first
    if (sort === 'price_asc') sortOption = { rent: 1 };
    else if (sort === 'price_desc') sortOption = { rent: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };

    const pageNumber = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, parseInt(limit));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
exports.getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone createdAt'
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // If property is not approved, only owner or admin can view it directly
    if (property.approvalStatus !== 'Approved') {
      // If user is authenticated, check if they are owner or admin
      const isOwner = req.user && property.owner._id.toString() === req.user.id;
      const isAdmin = req.user && req.user.role === 'Admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'This property listing is currently under review by administrators.',
        });
      }
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties owned by logged-in Property Owner
// @route   GET /api/properties/owner/my-properties
// @access  Private (Property Owner)
exports.getOwnerProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });

    // Compute stats for owner dashboard
    const stats = {
      total: properties.length,
      approved: properties.filter((p) => p.approvalStatus === 'Approved').length,
      pending: properties.filter((p) => p.approvalStatus === 'Pending').length,
      rejected: properties.filter((p) => p.approvalStatus === 'Rejected').length,
      available: properties.filter((p) => p.availability === true).length,
    };

    res.status(200).json({
      success: true,
      stats,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private (Property Owner)
exports.createProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      address,
      rent,
      propertyType,
      bedrooms,
      bathrooms,
      amenities,
      images,
      availability,
    } = req.body;

    // Validate required fields
    if (!title || !description || !location || !address || !rent || !propertyType || !bedrooms || !bathrooms) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required property details',
      });
    }

    // Default image if none provided
    const propertyImages = Array.isArray(images) && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80'];

    const property = await Property.create({
      owner: req.user.id,
      title,
      description,
      location,
      address,
      rent: Number(rent),
      propertyType,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      amenities: Array.isArray(amenities) ? amenities : [],
      images: propertyImages,
      availability: availability !== undefined ? availability : true,
      approvalStatus: 'Pending', // New listings require admin approval
    });

    res.status(201).json({
      success: true,
      message: 'Property listing submitted successfully! It is now pending admin approval.',
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a property listing
// @route   PUT /api/properties/:id
// @access  Private (Owner only)
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this property',
      });
    }

    const {
      title,
      description,
      location,
      address,
      rent,
      propertyType,
      bedrooms,
      bathrooms,
      amenities,
      images,
      availability,
    } = req.body;

    if (title) property.title = title;
    if (description) property.description = description;
    if (location) property.location = location;
    if (address) property.address = address;
    if (rent) property.rent = Number(rent);
    if (propertyType) property.propertyType = propertyType;
    if (bedrooms) property.bedrooms = Number(bedrooms);
    if (bathrooms) property.bathrooms = Number(bathrooms);
    if (amenities) property.amenities = Array.isArray(amenities) ? amenities : property.amenities;
    if (images && images.length > 0) property.images = images;
    if (availability !== undefined) property.availability = availability;

    // Save updated property
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Property listing updated successfully',
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a property listing
// @route   DELETE /api/properties/:id
// @access  Private (Owner or Admin)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Verify ownership or Admin role
    if (property.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this property',
      });
    }

    // Clean up associated bookings
    await Booking.deleteMany({ property: property._id });

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Property listing and associated bookings removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle property availability
// @route   PATCH /api/properties/:id/availability
// @access  Private (Owner)
exports.toggleAvailability = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    if (property.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to change availability for this property',
      });
    }

    property.availability = !property.availability;
    await property.save();

    res.status(200).json({
      success: true,
      message: `Property availability updated to ${property.availability ? 'Available' : 'Unavailable/Rented'}`,
      availability: property.availability,
    });
  } catch (error) {
    next(error);
  }
};
