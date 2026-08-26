const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    startTime: { 
        type: String, 
        required: true 
    },
    eventType: { 
        type: String, 
        enum: ['Weekly Meeting', 'Orientation', 'Event', 'Workshop', 'Project Meeting'],
        required: true 
    },
    checkInCode: { 
        type: String, 
        required: true, 
        unique: true 
    },
    isCheckInActive: { 
        type: Boolean, 
        default: true 
    },
    points: { 
        type: Number, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);