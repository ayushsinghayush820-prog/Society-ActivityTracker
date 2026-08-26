const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, required: true },
    description: { type: String },
    category: { 
        type: String, 
        enum: ['Technical', 'Design', 'Content', 'Management', 'Outreach', 'Event Operations'], // Categories from DTU doc
        required: true 
    },
    points: { type: Number, required: true },
    loggedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contribution', contributionSchema);