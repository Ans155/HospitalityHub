
const express = require('express');
const router = express.Router();
const Booking = require('../model/Booking');


exports.userBookings = async (req, res) => {
    try {
        const userEmail = req.params.userEmail;
    
        const bookedRooms = await Booking.find({ userEmail });
    
        res.json(bookedRooms);
      } catch (error) {
        console.error('Error fetching booked rooms:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  };