const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Update a user
router.put('/:id', async (req, res) => {
    // Check if user is authorized to update
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            // Hash password if user is updating password
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }

            // Update user in DB
            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err.message);
        }
    } 
    
    res.status(403).json('Not authorized to update');
});

// Delete a user
router.delete('/:id', async (req, res) => {
    // Check if the user is authorized to delete
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            // Delete user from DB
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json('Account deleted')
        } catch (err) {
            res.status(500).json(err.message)
        }
    }

    res.status(403).json('Not authorized to delete');
});

// Get a user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404);            
            throw new Error('User not found');
        }

        res.status(200).json(user);
    } catch (err) {
        res.json(err.message);
    }
});

module.exports = router;