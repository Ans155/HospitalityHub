const Booking = require('../model/Booking');

// View all bookings
exports.viewBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().exec();

    if (!bookings || bookings.length === 0) {
      // Handle the case when there are no bookings
      return res.status(200).json({ bookings: [] });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};
