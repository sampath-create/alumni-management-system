const mongoose = require('mongoose');

const WebinarSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    presenter: {
        type: String,
        required: true
    },
    company: {
        type: String
    }
});

module.exports = mongoose.model('Webinar', WebinarSchema);
