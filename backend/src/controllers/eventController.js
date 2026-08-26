const Event = require('../models/Event');

// @desc    Create a new event/meeting
// @route   POST /api/events
const createEvent = async (req, res) => {
    try {
        const { title, date, startTime, eventType, checkInCode, points } = req.body;

        const codeExists = await Event.findOne({ checkInCode });
        if (codeExists) {
            return res.status(400).json({ message: 'Check-in code already exists.' });
        }

        const event = await Event.create({
            title,
            date,
            startTime,
            eventType,
            checkInCode,
            points
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createEvent };