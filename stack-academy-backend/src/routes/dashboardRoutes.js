const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getDashboardStats,
    getContinueLearning,
    getRecentActivity,
    getAchievements,
    getRecommendations,
    updateProgress
} = require('../controllers/dashboardController');

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/continue-learning', getContinueLearning);
router.get('/recent-activity', getRecentActivity);
router.get('/achievements', getAchievements);
router.get('/recommendations', getRecommendations);
router.put('/progress/:courseId', updateProgress);

module.exports = router;