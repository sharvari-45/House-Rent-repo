const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Property must belong to an owner'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a property description'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide a location/city'],
      trim: true,
      index: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide complete street address'],
      trim: true,
    },
    rent: {
      type: Number,
      required: [true, 'Please specify monthly rent in INR'],
      min: [500, 'Rent must be at least ₹500'],
      index: true,
    },
    propertyType: {
      type: String,
      required: [true, 'Please select property type'],
      enum: {
        values: ['Apartment', 'Independent House', 'Villa', 'Studio', 'PG/Hostel'],
        message: '{VALUE} is not a valid property type',
      },
      default: 'Apartment',
      index: true,
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please specify number of bedrooms'],
      min: [1, 'Must have at least 1 bedroom'],
      default: 1,
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please specify number of bathrooms'],
      min: [1, 'Must have at least 1 bathroom'],
      default: 1,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
      ],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Property must have at least one image',
      },
    },
    availability: {
      type: Boolean,
      default: true,
      index: true,
    },
    approvalStatus: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Rejected'],
        message: '{VALUE} is not a valid approval status',
      },
      default: 'Pending',
      index: true,
    },
    adminFeedback: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for common search queries
propertySchema.index({ approvalStatus: 1, availability: 1, location: 1, rent: 1 });
propertySchema.index({ title: 'text', description: 'text', location: 'text', address: 'text' });

module.exports = mongoose.model('Property', propertySchema);
