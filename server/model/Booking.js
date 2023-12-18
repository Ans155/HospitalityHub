const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  roomType :{
    type: String,
    required: false,
  },
  roomNumber: {
    type: Number,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['requested', 'confirmed'],
    default: 'requested',
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
