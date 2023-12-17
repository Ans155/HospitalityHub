const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:userEmail/bookedRooms', userController.userBookings);

module.exports = router;
