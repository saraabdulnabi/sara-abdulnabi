const Course = require('../models/Course');
const Review = require('../models/Review');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
    try {
        const features = new APIFeatures(
            Course.find({ isPublished: true })
                .populate('instructor', 'firstName lastName avatar'),
            req.query
        )
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .search();

        const courses = await features.query;
        const total = await Course.countDocuments({ isPublished: true });

        res.status(200).json({
            success: true,
            count: courses.length,
            total,
            data: courses
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'firstName lastName avatar bio')
            .populate({
                path: 'reviews',
                match: { isApproved: true },
                populate: {
                    path: 'user',
                    select: 'firstName lastName avatar'
                }
            });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if course is published
        if (!course.isPublished && req.user?.role !== 'admin' && req.user?.role !== 'instructor') {
            return res.status(403).json({
                success: false,
                message: 'Course not available'
            });
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Instructor
exports.createCourse = async (req, res, next) => {
    try {
        req.body.instructor = req.user.id;

        const course = await Course.create(req.body);

        res.status(201).json({
            success: true,
            data: course
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
exports.updateCourse = async (req, res, next) => {
    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check ownership
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this course'
            });
        }

        course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check ownership
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this course'
            });
        }

        await course.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Publish course
// @route   PUT /api/courses/:id/publish
// @access  Private/Instructor
exports.publishCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check ownership
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to publish this course'
            });
        }

        course.isPublished = true;
        course.publishedAt = Date.now();
        await course.save();

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get courses by category
// @route   GET /api/courses/category/:category
// @access  Public
exports.getCoursesByCategory = async (req, res, next) => {
    try {
        const courses = await Course.find({
            category: req.params.category,
            isPublished: true
        })
            .populate('instructor', 'firstName lastName avatar')
            .limit(10);

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured courses
// @route   GET /api/courses/featured
// @access  Public
exports.getFeaturedCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({
            isPublished: true,
            $or: [
                { isBestseller: true },
                { isHot: true },
                { isNew: true }
            ]
        })
            .populate('instructor', 'firstName lastName avatar')
            .limit(6);

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        next(error);
    }
};