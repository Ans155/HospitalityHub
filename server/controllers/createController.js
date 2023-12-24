const Booking = require("../model/Booking");
const Room = require("../model/Room");
const uuid = require("uuid");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service:'gmail',
  host: "smtp.ethereal.gmail",
  port: 587,
  secure: false,
  auth: {
    user: "anshch12334@gmail.com", 
    pass: "ivnz lexp fcxa hhsa",   
  },
});

async function sendConfirmationEmail(userEmail, roomNumber, price,role) {
  try {
    const info = await transporter.sendMail({
      from: 'anshch12334@gmail.com',
      to: userEmail,              
      subject: role==='admin'? "Your Booking is confirmed" : "Your Booking is requested",
      html: `
        <h1>Hello there,</h1>
        <p>Your room number is ${roomNumber} and total cost is ${price}</p>
      `,
    });

    console.log(info.messageId); 
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
}

 const bookRoom = async (req, res) => {
  try {
    const { userEmail, roomType, roomNumber, startTime, endTime, price } = req.body.updatedBooking;
    const role= req.body.userRole;

    // Checking if the room exists
    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Checking for overlapping bookings for the same room
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
      return res.status(400).json({ error: "Overlapping booking exists" });
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
      status : role==='user' ? 'requested' : 'confirmed',
    });
    await newBooking.save();

    // Send a confirmation email
    await sendConfirmationEmail(userEmail, roomNumber, price,role);

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error booking room:", error);
    res.status(500).json({ error: "Failed to book a room" });
  }
};

const validateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const role= req.body.userRole;
    // Find the booking by ID
    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update the booking status to 'validated'
    booking.status = 'confirmed';
    
    // Save the updated booking to the database
    const updatedBooking = await booking.save();
    await sendConfirmationEmail(booking.userEmail, booking.roomNumber, booking.price,role);
    res.json(updatedBooking);
  } catch (error) {
    console.error('Error validating booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  bookRoom,
  validateBooking,
};
