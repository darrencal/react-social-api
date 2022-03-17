const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const {
    updateUser,
    deleteUser,
    getUser,
    followUser,
    unfollowUser
} = require('../controllers/userController');

router.put('/:id', asyncHandler(updateUser));
router.delete('/:id', asyncHandler(deleteUser));
router.get('/:id', asyncHandler(getUser));
router.put('/:id/follow', asyncHandler(followUser));
router.put('/:id/unfollow', asyncHandler(unfollowUser));

module.exports = router;