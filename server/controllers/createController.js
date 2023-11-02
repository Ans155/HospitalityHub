const Booking = require('../model/Booking');
const Room = require('../model/Room');
const uuid = require('uuid');
exports.bookRoom = async (req, res) => {
  try {

    const { userEmail, roomType, roomNumber, startTime, endTime, price } = req.body;

    // Check if the room exists
    const room = await Room.findOne({ roomNumber });
    if (!room)
    {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check for overlapping bookings for the same room
    const overlappingBooking = await Booking.findOne({
      roomNumber,
      $or: [
        {
          startTime: { $lte: startTime },
          endTime: { $gte: startTime },
        },
        {
          startTime: { $lte: endTime },
          endTime: { $gte: endTime },
        },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({ error: 'Overlapping booking exists' });
    }
    const newBooking = new Booking({
      bookingId: uuid.v4(),
      userEmail,
      roomType,
      roomNumber,
      startTime,
      endTime,
      price,
      roomType,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error booking room:', error);
    res.status(500).json({ error: 'Failed to book room' });
  }
};
