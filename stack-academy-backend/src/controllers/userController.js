const User = require('../models/User');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
    try {
        const features = new APIFeatures(User.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const users = await features.query;

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('enrolledCourses.course')
            .populate('wishlist');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update profile
// @route   PUT /api/users/profile/update
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const { firstName, lastName, bio, phone, country, city, avatar } = req.body;

        const user = await User.findById(req.user.id);

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (bio) user.bio = bio;
        if (phone) user.phone = phone;
        if (country) user.country = country;
        if (city) user.city = city;
        if (avatar) user.avatar = avatar;

        await user.save();

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private
exports.getUserStats = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('enrolledCourses.course');

        const stats = {
            totalCourses: user.enrolledCourses.length,
            completedCourses: user.enrolledCourses.filter(c => c.completed).length,
            inProgressCourses: user.enrolledCourses.filter(c => !c.completed).length,
            totalLearningHours: user.stats.totalLearningHours,
            certificatesEarned: user.stats.certificatesEarned
        };

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add to wishlist
// @route   POST /api/users/wishlist/:courseId
// @access  Private
exports.addToWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.wishlist.includes(req.params.courseId)) {
            return res.status(400).json({
                success: false,
                message: 'Course already in wishlist'
            });
        }

        user.wishlist.push(req.params.courseId);
        await user.save();

        res.status(200).json({
            success: true,
            data: user.wishlist
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:courseId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        user.wishlist = user.wishlist.filter(
            id => id.toString() !== req.params.courseId
        );

        await user.save();

        res.status(200).json({
            success: true,
            data: user.wishlist
        });
    } catch (error) {
        next(error);
    }
};