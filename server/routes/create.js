const express = require('express');
const router = express.Router();
const createController = require('../controllers/createController');

/**
 * @route POST api/book
 * @description Book a room
 * @access public
 */
router.post('/', createController.bookRoom);

module.exports = router;
