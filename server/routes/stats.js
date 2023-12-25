const express = require('express');
const router = express.Router();
const statController = require('../controllers/statController');

router.get('/', statController.stat);

module.exports = router;
