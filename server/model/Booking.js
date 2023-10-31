const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
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
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
