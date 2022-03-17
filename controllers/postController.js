const Post = require('../models/Post');
const User = require('../models/User');

// Create a post
const createPost = async (req, res) => {
    const newPost = new Post(req.body);

    const post = await newPost.save();
    res.status(200).json(post);
}

// Update a post
const updatePost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    if (req.body.userId !== post.userId) {
        res.status(403);
        throw new Error('Not authorized to update post');
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedPost);
}

// Delete a post
const deletePost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    if (req.body.userId !== post.userId) {
        res.status(403);
        throw new Error('Not authorized to delete post');
    }

    await post.deleteOne();
    res.status(200).json('Post deleted');
}

// Like or dislike a post
const likePost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    if (post.likes.includes(req.body.userId)) {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json('Post has been disliked');
    } else {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json('Post has been liked');
    }
}

// Get a post
const getPost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if(!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    res.status(200).json(post);
}

// Get timeline posts
const getTimelinePosts = async (req, res) => {
    const currentUser = await User.findById(req.body.userId);
    if (!currentUser) {
        res.status(404);
        throw new Error('Could not get current user');
    }

    // Get user's own posts and posts from users being followed
    const userIds = [currentUser._id.toString(), ...currentUser.following];
    const posts = await Post.find({ userId: { $in: userIds } });

    res.status(200).json(posts);
}

module.exports = {
    createPost,
    updatePost,
    deletePost,
    likePost,
    getPost,
    getTimelinePosts,
};