const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const passport = require('../middleware/authMiddleware');

/**
 * @route GET /admin/bookings
 * @description View all bookings
 * @access public
 */
router.get('/bookings',viewController.viewBookings);
//router.get('/request',viewRController.viewRBookings);
module.exports = router;
