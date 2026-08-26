const express = require('express');
const router = express.Router();

// 1. Import Controllers
const { getUserProfile, getLeaderboard } = require('../controllers/userController');

// 2. Import Middleware
const { protect, admin } = require('../middlewares/authMiddleware');

// 3. Import Models (SUPER IMPORTANT FOR NEW ROUTES)
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Contribution = require('../models/Contribution');

// ==========================================
// STANDARD USER ROUTES
// ==========================================
router.get('/profile', protect, getUserProfile);
router.get('/leaderboard', protect, getLeaderboard);

// ==========================================
// ADMIN STATS ROUTE (For Dashboard Overview)
// ==========================================
router.get('/admin/stats', protect, admin, async (req, res) => {
    try {
        const members = await User.find({ role: { $ne: 'ADMIN' } }).select('-password');
        
        let stats = {
            total: members.length,
            active: 0,
            lowActivity: 0,
            inactive: 0,
            memberList: []
        };

        // Automatic Inactivity Detection Logic
        members.forEach(member => {
            let status = 'INACTIVE';
            
            // Simplified scoring logic for categorization
            if (member.activityScore >= 20) {
                status = 'ACTIVE';
                stats.active++;
            } else if (member.activityScore > 0 && member.activityScore < 20) {
                status = 'LOW ACTIVITY';
                stats.lowActivity++;
            } else {
                stats.inactive++;
            }

            stats.memberList.push({
                _id: member._id,
                name: member.name,
                department: member.department,
                score: member.activityScore || 0,
                status: status
            });
        });

        // Sort members by score (highest first)
        stats.memberList.sort((a, b) => b.score - a.score);

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching stats', error: error.message });
    }
});

// ==========================================
// MEMBER TIMELINE ROUTE (For Activity History)
// ==========================================
router.get('/me/timeline', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Fetch user's attendances and contributions
        const attendances = await Attendance.find({ member: userId }).populate('event', 'title date');
        const contributions = await Contribution.find({ member: userId });

        let timeline = [];

        // Format attendances
        attendances.forEach(a => {
            if (a.event) {
                timeline.push({
                    id: a._id,
                    type: 'Event Attendance',
                    title: a.event.title,
                    points: a.pointsEarned || 10,
                    date: a.checkInTime || a.createdAt
                });
            }
        });

        // Format contributions
        contributions.forEach(c => {
            timeline.push({
                id: c._id,
                type: 'Special Contribution',
                title: c.title,
                points: c.points,
                date: c.date
            });
        });

        // Sort by newest first
        timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(timeline);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching timeline', error: error.message });
    }
});
// ==========================================
// ADMIN: FULL MEMBER MANAGEMENT
// ==========================================

// 1. Get all members for the Admin Table (Search/Filter ready)
router.get('/admin/members', protect, admin, async (req, res) => {
    try {
        const members = await User.find({ role: { $ne: 'ADMIN' } }).select('-password');
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// 2. Get specific member profile & timeline (Individual View)
router.get('/admin/members/:id', protect, admin, async (req, res) => {
    try {
        const member = await User.findById(req.params.id).select('-password');
        if (!member) return res.status(404).json({ message: 'Member not found' });

        const attendances = await Attendance.find({ member: req.params.id }).populate('event', 'title date');
        const contributions = await Contribution.find({ member: req.params.id });

        let timeline = [];
        attendances.forEach(a => {
            if (a.event) {
                timeline.push({ id: a._id, type: 'Event Attendance', title: a.event.title, points: a.pointsEarned || 10, date: a.checkInTime || a.createdAt });
            }
        });
        contributions.forEach(c => timeline.push({ id: c._id, type: 'Contribution', title: c.title, points: c.points, date: c.date }));
        
        timeline.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json({ member, timeline });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// 3. Manual Status Override
router.put('/admin/members/:id/status', protect, admin, async (req, res) => {
    try {
        const member = await User.findById(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });

        // Update to 'AUTO', 'ACTIVE', or 'INACTIVE'
        member.statusOverride = req.body.statusOverride; 
        await member.save();
        res.json({ message: 'Status updated successfully', member });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
module.exports = router;