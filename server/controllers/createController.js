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
  //     const startDate = new Date(startTime);
  // const endDate = new Date(endTime);

  // // Calculate the time difference in milliseconds
  // const timeDiff = endDate - startDate;

  // // Calculate the number of hours
  // const hours = timeDiff / (1000 * 60 * 60);
    // Calculate the price based on the hourly rate and duration
    // const hourlyRate = room.hourlyRate;
    // const durationInHours = (endTime - startTime) / 1000 / 60 / 60;
    // const price = hourlyRate * durationInHours;

    // Create a new booking
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
