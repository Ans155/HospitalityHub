const express = require('express');
const router = express.Router();
const updateController = require('../controllers/deleteController');

/**
 * @route DELETE /api/book/:bookingId
 * @description Delete a booking with refund conditions
 * @access public
 */
router.delete('/:bookingId', updateController.deleteBooking);

module.exports = router;
