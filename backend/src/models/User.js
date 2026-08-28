const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        // Removed strict enum to prevent frontend validation crashes
        default: 'member'
    },
    // Member-specific fields
    department: {
        type: String,
        default: 'General'
    },
    position: {
        type: String,
        default: 'member'
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    // Added points field to prevent the "Transmit Points" 500 Server Error
    points: {
        type: Number,
        default: 0
    },
    activityScore: {
        type: Number,
        default: 0
    },
    statusOverride: {
        type: String,
        enum: ['AUTO', 'ACTIVE', 'INACTIVE'],
        default: 'AUTO'
    },
    activityStatus: {
        type: String,
        enum: ['ACTIVE', 'LOW_ACTIVITY', 'INACTIVE'],
        default: 'ACTIVE'
    }
}, { timestamps: true }); 

module.exports = mongoose.model('User', userSchema);