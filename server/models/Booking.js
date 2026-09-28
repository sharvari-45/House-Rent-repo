const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must have a tenant reference'],
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Booking must have a property reference'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must have an owner reference'],
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    moveInDate: {
      type: Date,
      required: [true, 'Please provide intended move-in date'],
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
        message: '{VALUE} is not a valid booking status',
      },
      default: 'Pending',
      index: true,
    },
    ownerNotes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate active booking requests for same property by same tenant
bookingSchema.index({ tenant: 1, property: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
