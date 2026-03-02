const User = require('../models/User');
const Course = require('../models/Course');
const Order = require('../models/Order');
const Review = require('../models/Review');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('enrolledCourses.course');

        // Calculate stats
        const totalCourses = user.enrolledCourses.length;
        const completedCourses = user.enrolledCourses.filter(c => c.completed).length;
        const inProgressCourses = totalCourses - completedCourses;
        
        const totalLearningHours = user.enrolledCourses.reduce((acc, curr) => {
            return acc + (curr.course?.duration?.hours || 0);
        }, 0);

        const recentActivity = await getRecentActivity(req.user.id);

        const stats = {
            enrolledCourses: totalCourses,
            completedCourses,
            inProgressCourses,
            totalLearningHours,
            certificatesEarned: user.stats.certificatesEarned,
            projectsCompleted: user.stats.completedProjects || 0,
            recentActivity
        };

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get continue learning courses
// @route   GET /api/dashboard/continue-learning
// @access  Private
exports.getContinueLearning = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'enrolledCourses.course',
                match: { isPublished: true }
            });

        const continueCourses = user.enrolledCourses
            .filter(c => !c.completed && c.progress > 0 && c.progress < 100)
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .slice(0, 3);

        res.status(200).json({
            success: true,
            data: continueCourses
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get recent activity
// @route   GET /api/dashboard/recent-activity
// @access  Private
exports.getRecentActivity = async (req, res, next) => {
    try {
        const activities = await getRecentActivity(req.user.id);

        res.status(200).json({
            success: true,
            data: activities
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get achievements
// @route   GET /api/dashboard/achievements
// @access  Private
exports.getAchievements = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('enrolledCourses.course');

        const achievements = [];

        // Check for first course
        if (user.enrolledCourses.length >= 1) {
            achievements.push({
                icon: 'fa-rocket',
                name: 'Quick Starter',
                description: 'Enrolled in your first course',
                earnedAt: user.enrolledCourses[0]?.enrolledAt
            });
        }

        // Check for 7 day streak
        const hasSevenDayStreak = await checkStreak(user._id, 7);
        if (hasSevenDayStreak) {
            achievements.push({
                icon: 'fa-fire',
                name: '7 Day Streak',
                description: 'Learned 7 days in a row',
                earnedAt: new Date()
            });
        }

        // Check for course completion
        const completedCount = user.enrolledCourses.filter(c => c.completed).length;
        if (completedCount >= 1) {
            achievements.push({
                icon: 'fa-star',
                name: 'Course Graduate',
                description: 'Completed your first course',
                earnedAt: user.enrolledCourses.find(c => c.completed)?.completedAt
            });
        }

        // Check for helpful reviews
        const helpfulReviews = await Review.countDocuments({
            user: user._id,
            helpful: { $exists: true, $not: { $size: 0 } }
        });
        if (helpfulReviews >= 3) {
            achievements.push({
                icon: 'fa-heart',
                name: 'Helpful Reviewer',
                description: 'Your reviews helped 3+ students',
                earnedAt: new Date()
            });
        }

        res.status(200).json({
            success: true,
            data: achievements
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get recommendations
// @route   GET /api/dashboard/recommendations
// @access  Private
exports.getRecommendations = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('enrolledCourses.course');

        // Get categories from user's enrolled courses
        const enrolledCategories = user.enrolledCourses
            .map(c => c.course?.category)
            .filter(Boolean);

        // Get recommendations based on categories and level
        const recommendations = await Course.find({
            isPublished: true,
            _id: { $nin: user.enrolledCourses.map(c => c.course?._id) },
            $or: [
                { category: { $in: enrolledCategories } },
                { level: { $in: ['Beginner', 'All Levels'] } }
            ]
        })
            .populate('instructor', 'firstName lastName avatar')
            .limit(4);

        res.status(200).json({
            success: true,
            data: recommendations
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update course progress
// @route   PUT /api/dashboard/progress/:courseId
// @access  Private
exports.updateProgress = async (req, res, next) => {
    try {
        const { progress } = req.body;

        const user = await User.findById(req.user.id);

        const courseIndex = user.enrolledCourses.findIndex(
            c => c.course.toString() === req.params.courseId
        );

        if (courseIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Course not found in your enrolled courses'
            });
        }

        user.enrolledCourses[courseIndex].progress = progress;

        if (progress === 100) {
            user.enrolledCourses[courseIndex].completed = true;
            user.enrolledCourses[courseIndex].completedAt = Date.now();
            user.stats.completedCourses += 1;
            user.stats.certificatesEarned += 1;
        }

        await user.save();

        res.status(200).json({
            success: true,
            data: user.enrolledCourses[courseIndex]
        });
    } catch (error) {
        next(error);
    }
};

// Helper function to get recent activity
async function getRecentActivity(userId) {
    const user = await User.findById(userId)
        .populate('enrolledCourses.course');

    const activities = [];

    // Course completions
    user.enrolledCourses
        .filter(c => c.completed && c.completedAt)
        .forEach(c => {
            activities.push({
                type: 'completed',
                text: `Completed "${c.course?.title}"`,
                course: c.course?.title,
                time: formatTimeAgo(c.completedAt),
                timestamp: c.completedAt
            });
        });

    // Course starts
    user.enrolledCourses
        .filter(c => c.enrolledAt)
        .forEach(c => {
            activities.push({
                type: 'started',
                text: `Started "${c.course?.title}"`,
                course: c.course?.title,
                time: formatTimeAgo(c.enrolledAt),
                timestamp: c.enrolledAt
            });
        });

    // Sort by most recent
    activities.sort((a, b) => b.timestamp - a.timestamp);

    return activities.slice(0, 5);
}

// Helper function to check streak
async function checkStreak(userId, days) {
    // Implement streak checking logic
    // This would check daily learning activity
    return false;
}

// Helper function to format time ago
function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    
    return 'Just now';
}