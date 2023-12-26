// routes/statistics.js
const express = require('express');
//const router = express.Router();
const Booking = require('../model/Booking');
const User = require('../model/User');

// Endpoint to get statistics
const stat = async (req,res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
        {
          $match: { status: 'confirmed' }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$price' },
          },
        },
      ]);
      const monthlyStats = await Booking.aggregate([
        {
          $match: { status: 'confirmed' }
        },
        {
          $group: {
            _id: { $month: '$startTime' },
            totalAmount: { $sum: '$price' },
            totalBookings: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 }
        },
      ]);

    const response = {
      totalUsers,
      totalBookings,
      totalRevenue: totalRevenue.length ? totalRevenue[0].totalAmount : 0,
      monthlyStats,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {stat};
