const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/webinars', require('./routes/webinars'));
app.use('/api/mentorship', require('./routes/mentorship'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
