const express = require('express');
const router = express.Router();
const editController = require('../controllers/editController');

/**
 * @route PUT /api/book/:bookingId
 * @description Edit a booking
 * @access public
 */
router.put('/:bookingId', editController.editBooking);

module.exports = router;
