const express = require('express');
const router = express.Router();
const Webinar = require('../models/Webinar');

// @route   GET api/webinars
// @desc    Get all webinars
router.get('/', async (req, res) => {
    try {
        const webinars = await Webinar.find().sort({ date: -1 });
        res.json(webinars);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/webinars
// @desc    Create a webinar
router.post('/', async (req, res) => {
    const { title, description, date, time, link, presenter, company } = req.body;

    try {
        const newWebinar = new Webinar({
            title,
            description,
            date,
            time,
            link,
            presenter,
            company
        });

        const webinar = await newWebinar.save();
        res.json(webinar);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
