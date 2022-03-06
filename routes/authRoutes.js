const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');

// Register new user
router.post('/register', asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
    });

    // Save user to DB
    const user = await newUser.save();
    res.status(200).json(user);
}));

// Login user
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if email exists
    const user = await User.findOne({ email: email });

    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // Check if password is valid
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    res.status(200).json(user);
}));

module.exports = router;