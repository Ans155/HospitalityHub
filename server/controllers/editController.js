const Booking = require('../model/Booking');
const Room = require('../model/Room');
const { v4: uuidv4 } = require('uuid'); 

const hasOverlap = (booking1, booking2) => {
  return (
    (booking1.startTime < booking2.endTime && booking1.endTime > booking2.startTime) ||
    (booking2.startTime < booking1.endTime && booking2.endTime > booking1.startTime)
  );
};

exports.editBooking = async (req, res) => {
  try {

    const { bookingId } = req.params;

    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const roomNumber = booking.roomNumber;

    const room = await Room.findOne({ roomNumber: req.body.roomNumber });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const overlappingBooking = await Booking.findOne({
      roomNumber: req.body.roomNumber,
      bookingId: { $ne: bookingId }, 
      $or: [
        {
          startTime: { $lt: new Date(req.body.endTime) },
          endTime: { $gt: new Date(req.body.startTime) },
        },
        {
          startTime: { $lt: new Date(req.body.endTime) },
          endTime: { $gt: new Date(req.body.startTime) },
        },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({ error: 'Overlapping booking exists' });
    }


    if (req.body.userEmail) {
      booking.userEmail = req.body.userEmail;
    }

    if (req.body.roomNumber) {
      booking.roomNumber = req.body.roomNumber;
    }
    if (req.body.roomType) {
      booking.roomType = req.body.roomType;
    }

    if (req.body.startTime) {
      booking.startTime = new Date(req.body.startTime);
    }

    if (req.body.endTime) {
      booking.endTime = new Date(req.body.endTime);
    }

    // const hourlyRate = room.hourlyRate;
    // const durationInHours = (booking.endTime - booking.startTime) / 1000 / 60 / 60;
    // booking.price = hourlyRate * durationInHours;

    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error editing booking:', error);
    res.status(500).json({ error: 'Failed to edit booking' });
  }
};
