const express = require('express');
const router = express.Router();
const MentorshipRequest = require('../models/MentorshipRequest');

// @route   GET api/mentorship
// @desc    Get all mentorship requests
router.get('/', async (req, res) => {
    try {
        const requests = await MentorshipRequest.find().sort({ date: -1 });
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/mentorship
// @desc    Create a mentorship request
router.post('/', async (req, res) => {
    const { mentor, student, message } = req.body;

    try {
        const newRequest = new MentorshipRequest({
            mentor,
            student,
            message
        });

        const request = await newRequest.save();
        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/mentorship/:id
// @desc    Update mentorship request status
router.put('/:id', async (req, res) => {
    const { status } = req.body;

    try {
        let request = await MentorshipRequest.findById(req.params.id);

        if (!request) return res.status(404).json({ msg: 'Request not found' });

        request.status = status;

        await request.save();
        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
