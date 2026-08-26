const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    }
}, { timestamps: true });

attendanceSchema.index({ member: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);