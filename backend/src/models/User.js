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
        enum: ['member', 'admin'],
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
// timestamps: true automatically createdAt aur updatedAt fields add kar dega

module.exports = mongoose.model('User', userSchema);