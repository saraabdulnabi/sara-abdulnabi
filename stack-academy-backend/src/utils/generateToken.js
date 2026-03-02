const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = generateToken(user._id, user.role);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            enrolledCourses: user.enrolledCourses,
            stats: user.stats
        }
    });
};

module.exports = { generateToken, sendTokenResponse };