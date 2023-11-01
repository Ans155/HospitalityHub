const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewRoomController');

/**
 * @route GET /admin/bookings
 * @description View all bookings
 * @access public
 */
router.get('/Rooms', viewController.viewRooms);

module.exports = router;
