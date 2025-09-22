const mongoose = require('mongoose');

const MentorshipRequestSchema = new mongoose.Schema({
    mentor: {
        type: String,
        required: true
    },
    student: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MentorshipRequest', MentorshipRequestSchema);
