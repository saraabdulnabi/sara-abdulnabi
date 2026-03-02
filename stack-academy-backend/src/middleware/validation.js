const { body, validationResult } = require('express-validator');

// Validation rules for user registration
exports.validateRegister = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2 }).withMessage('First name must be at least 2 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('First name can only contain letters'),
    
    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Last name can only contain letters'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('Password must contain at least one letter and one number'),
    
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match')
];

// Validation rules for login
exports.validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required')
];

// Validation rules for course creation
exports.validateCourse = [
    body('title')
        .trim()
        .notEmpty().withMessage('Course title is required')
        .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
    
    body('description')
        .trim()
        .notEmpty().withMessage('Course description is required')
        .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
    
    body('category')
        .notEmpty().withMessage('Category is required')
        .isIn([
            'Frontend Development',
            'Backend Development',
            'Full Stack Development',
            'Database',
            'DevOps',
            'Mobile Development',
            'Data Science',
            'UI/UX Design'
        ]).withMessage('Invalid category'),
    
    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    
    body('duration.hours')
        .notEmpty().withMessage('Duration hours are required')
        .isInt({ min: 1 }).withMessage('Duration hours must be at least 1'),
    
    body('duration.weeks')
        .notEmpty().withMessage('Duration weeks are required')
        .isInt({ min: 1 }).withMessage('Duration weeks must be at least 1'),
    
    body('thumbnail')
        .notEmpty().withMessage('Course thumbnail is required')
        .isURL().withMessage('Thumbnail must be a valid URL')
];

// Validation rules for review
exports.validateReview = [
    body('rating')
        .notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    
    body('title')
        .trim()
        .notEmpty().withMessage('Review title is required')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    
    body('comment')
        .trim()
        .notEmpty().withMessage('Review comment is required')
        .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
];

// Validation rules for updating profile
exports.validateProfileUpdate = [
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('First name must be at least 2 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('First name can only contain letters'),
    
    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Last name can only contain letters'),
    
    body('phone')
        .optional()
        .matches(/^[0-9+\-\s]+$/).withMessage('Please enter a valid phone number'),
    
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters')
];

// Check validation results
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};