const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const {
    createPost,
    updatePost,
    deletePost,
    likePost,
    getPost,
    getTimelinePosts
} = require('../controllers/postController');

router.post('/', asyncHandler(createPost));
router.put('/:id', asyncHandler(updatePost));
router.delete('/:id', asyncHandler(deletePost));
router.put('/:id/like', asyncHandler(likePost));
router.get('/:id', asyncHandler(getPost));
router.get('/timeline/all', asyncHandler(getTimelinePosts));

module.exports = router;