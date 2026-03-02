const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateCourse, validate } = require('../middleware/validation');
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    publishCourse,
    getCoursesByCategory,
    getFeaturedCourses
} = require('../controllers/courseController');

// Public routes
router.get('/', getCourses);
router.get('/featured', getFeaturedCourses);
router.get('/category/:category', getCoursesByCategory);
router.get('/:id', getCourse);

// Protected routes
router.use(protect);

// Instructor/Admin routes
router.use(authorize('instructor', 'admin'));
router.post('/', validateCourse, validate, createCourse);
router.put('/:id/publish', publishCourse);

router.route('/:id')
    .put(validateCourse, validate, updateCourse)
    .delete(deleteCourse);

module.exports = router;