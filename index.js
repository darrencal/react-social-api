const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

mongoose.connect(process.env.MONGO_URL, () => {
    console.log('Connected to MongoDB');
});

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

const PORT = 8800;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
