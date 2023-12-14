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

async function sendConfirmationEmail(userEmail, roomNumber, price) {
  try {
    const info = await transporter.sendMail({
      from: 'anshch12334@gmail.com',
      to: userEmail,              
      subject: "Your Booking is confirmed",
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

exports.bookRoom = async (req, res) => {
  try {
    const { userEmail, roomType, roomNumber, startTime, endTime, price } = req.body;

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
    });
    await newBooking.save();

    // Send a confirmation email
    await sendConfirmationEmail(userEmail, roomNumber, price);

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error booking room:", error);
    res.status(500).json({ error: "Failed to book a room" });
  }
};
