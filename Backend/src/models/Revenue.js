const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    required: true,
  },
  courtRevenue: {
    type: Number,
    required: true,
  },
  drinkRevenue: {
    type: Number,
    default: 0,
  },
  totalRevenue: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Revenue', revenueSchema);
