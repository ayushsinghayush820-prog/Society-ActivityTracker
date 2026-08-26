const express = require('express');
const router = express.Router();
const { createEvent } = require('../controllers/eventController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Route for creating an event
router.post('/', protect, admin, createEvent);

module.exports = router;