const Room = require('../model/Room');

// View all bookings
exports.viewRooms = async (req, res) => {
  try {
    const Rooms = await Room.find().exec();

    if (!Rooms || Rooms.length === 0) {
      // Handle the case when there are no bookings
      return res.status(200).json({ Rooms: [] });
    }

    res.status(200).json(Rooms);
  } catch (error) {
    console.error('Error fetching Rooms:', error);
    res.status(500).json({ error: 'Failed to fetch Rooms' });
  }
};