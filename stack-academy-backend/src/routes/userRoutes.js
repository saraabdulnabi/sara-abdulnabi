const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateProfileUpdate, validate } = require('../middleware/validation');
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    updateProfile,
    getUserStats,
    addToWishlist,
    removeFromWishlist
} = require('../controllers/userController');

// Protected routes for all users
router.use(protect);

router.get('/profile/stats', getUserStats);
router.put('/profile/update', validateProfileUpdate, validate, updateProfile);
router.post('/wishlist/:courseId', addToWishlist);
router.delete('/wishlist/:courseId', removeFromWishlist);

// Admin only routes
router.use(authorize('admin'));
router.route('/')
    .get(getUsers);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;