const Booking = require('../model/Booking');

//To Calculate the time difference between two dates in hours
const calculateTimeDifferenceInHours = (date1, date2) => {
  const diffInMs = date1 - date2;
  return diffInMs / (1000 * 60 * 60);
};

// Delete a booking with refund conditions
exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking by its bookingId
    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Calculate the time difference in hours
    const currentTime = new Date();
    const startTime = new Date(booking.startTime);
    const timeDifferenceInHours = calculateTimeDifferenceInHours(startTime, currentTime);

    let refundPercentage = 0;

    if (timeDifferenceInHours > 48) {
      refundPercentage = 100; // Complete refund
    } else if (timeDifferenceInHours >= 24 && timeDifferenceInHours <= 48) {
      refundPercentage = 50; // 50% refund
    }

    // Perform the actual booking deletion from the database
    await Booking.deleteOne({ bookingId });

    const response = {
      message: 'Booking deleted successfully',
      refundPercentage,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};
