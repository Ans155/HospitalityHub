const Booking = require('../model/Booking');
const Room = require('../model/Room');

// Edit a booking
exports.editBooking = async (req, res) => {
  try {
    console.log(req.params.bookingId);
    const { userEmail, roomNumber, startTime, endTime, price} = req.body;
    // Check if the room exists
    const room = await Room.findOne({ roomNumber });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check for overlapping bookings for the same room
    const overlappingBooking = await Booking.findOne({
      roomNumber,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
      _id: { $ne: req.params.id }, // Exclude the current booking from the check
    });

    if (overlappingBooking) {
      return res.status(400).json({ error: 'Overlapping booking exists' });
    }

    // Calculate the price based on the hourly rate and updated duration
    // const hourlyRate = room.hourlyRate;
    // const durationInHours = (endTime - startTime) / 1000 / 60 / 60;
    // const price = hourlyRate * durationInHours;

    // Update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        userEmail,
        roomNumber,
        startTime,
        endTime,
        price,
      },
      { new: true }
    );

    res.status(200).json(updatedBooking);
    console.log("Successfull")
  } catch (error) {
    console.error('Error editing booking:', error);
    res.status(500).json({ error: 'Failed to edit booking' });
  }
};
