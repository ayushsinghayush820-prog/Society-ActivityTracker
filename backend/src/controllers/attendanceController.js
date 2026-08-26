const Attendance = require('../models/Attendance');
const Event = require('../models/Event');
const User = require('../models/User');


const checkIn = async (req, res) => {
    try {
        const { checkInCode } = req.body;
        const memberId = req.user._id;

        const event = await Event.findOne({ checkInCode });
        if (!event) {
            return res.status(404).json({ message: 'Invalid check-in code.' });
        }

        if (!event.isCheckInActive) {
            return res.status(400).json({ message: 'The check-in window for this event is closed.' });
        }

        const existingRecord = await Attendance.findOne({ member: memberId, event: event._id });
        if (existingRecord) {
            return res.status(400).json({ message: 'You have already checked in for this event.' });
        }

        await Attendance.create({
            member: memberId,
            event: event._id
        });

        await User.findByIdAndUpdate(memberId, {
            $inc: { activityScore: event.points } 
        });

        return res.status(201).json({
            message: 'Check-in successful',
            eventDetails: {
                title: event.title,
                pointsEarned: event.points
            }
        });

    } catch (error) {
        console.error('Check-in error:', error);
        return res.status(500).json({ message: 'Failed to process check-in.' });
    }
};

module.exports = { checkIn };