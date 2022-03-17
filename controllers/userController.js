const User = require('../models/User');
const bcrypt = require('bcrypt');

// Update a user
const updateUser = async (req, res) => {
    // Check if user is authorized to update
    if (req.body.userId !== req.params.id && !req.body.isAdmin) {
        res.status(403);
        throw new Error('Not authorized to update');
    }

    // Hash password if user is updating password
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    // Update user in DB
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(user);
}

// Delete a user
const deleteUser = async (req, res) => {
    // Check if the user is authorized to delete
    if (req.body.userId !== req.params.id && !req.body.isAdmin) {
        res.status(403);
        throw new Error('Not authorized to delete');
    }

    // Delete user from DB
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('Account deleted');
}

// Get a user
const getUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if(!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json(user);
}

// Follow a user
const followUser = async (req, res) => {
    if (req.body.userId === req.params.id) {
        res.status(403);
        throw new Error('Cannot follow yourself');
    }

    // Get user to follow
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Get current logged in user
    const currentUser = await User.findById(req.body.userId);
    if (!currentUser) {
        res.status(404);
        throw new Error('Could not get current user');
    }

    // Check if they are already following
    if (user.followers.includes(req.body.userId)) {
        res.status(400);
        throw new Error('You already follow this user');
    }

    // Update users' followers and following in the DB
    await user.updateOne({ $push: { followers: req.body.userId } });
    await currentUser.updateOne({ $push: { following: req.params.id } });
    res.status(200).json('User has been followed');
}

// Unfollow a user
const unfollowUser = async (req, res) => {
    if (req.body.userId === req.params.id) {
        res.status(403);
        throw new Error('Cannot unfollow yourself');
    }

    // Get user to unfollow
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Get current logged in user
    const currentUser = await User.findById(req.body.userId);
    if (!currentUser) {
        res.status(404);
        throw new Error('Could not get current user');
    }

    // Check if not following
    if (!user.followers.includes(req.body.userId)) {
        res.status(400);
        throw new Error('You do not follow this user');
    }

    // Remove user's id from followers and following in the DB
    await user.updateOne({ $pull: { followers: req.body.userId } });
    await currentUser.updateOne({ $pull: { following: req.params.id } });
    res.status(200).json('User has been unfollowed');
}

module.exports = {
    updateUser,
    deleteUser,
    getUser,
    followUser,
    unfollowUser,
};