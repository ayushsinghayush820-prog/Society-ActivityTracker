const express = require('express');
const router = express.Router();
const { checkIn } = require('../controllers/attendanceController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/check-in', protect, checkIn);

module.exports = router;