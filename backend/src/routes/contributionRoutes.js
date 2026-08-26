const express = require('express');
const router = express.Router();
const Contribution = require('../models/Contribution');
const User = require('../models/User');
const { protect, admin } = require('../middlewares/authMiddleware'); // Assuming you have these

// POST /api/contributions - Log a new contribution
router.post('/', protect, admin, async (req, res) => {
    try {
        const { memberId, title, description, category, points } = req.body;

        // 1. Save the contribution
        const contribution = await Contribution.create({
            member: memberId,
            title,
            description,
            category,
            points,
            loggedBy: req.user._id // The admin logging it
        });

        // 2. Add points to the user's Activity Score
        const user = await User.findById(memberId);
        if (user) {
            user.activityScore = (user.activityScore || 0) + Number(points);
            await user.save();
        }

        res.status(201).json({ message: 'Contribution logged successfully', contribution });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET /api/contributions/users - Helper route to fetch all users for the dropdown
router.get('/users', protect, admin, async (req, res) => {
    try {
       const users = await User.find({ role: { $ne: 'ADMIN' } }).select('name email _id');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;