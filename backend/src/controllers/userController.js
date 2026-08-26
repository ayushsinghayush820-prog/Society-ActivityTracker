const User = require('../models/User');

// @desc    Get user profile and current score
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        // req.user._id comes from our protect middleware
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};

// @desc    Get top members by activity score
// @route   GET /api/users/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
    try {
        // Find all users, sort by activityScore in descending order (-1), and limit to top 10
        const leaderboard = await User.find({})
            .sort({ activityScore: -1 })
            .limit(10)
            .select('name department activityScore role');

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching leaderboard' });
    }
};

module.exports = { getUserProfile, getLeaderboard };