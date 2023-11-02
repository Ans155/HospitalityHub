const express = require('express');
const router = express.Router();
const filtersController = require('../controllers/filtersController');

router.post('/bookings', filtersController.filterBookings);

module.exports = router;
