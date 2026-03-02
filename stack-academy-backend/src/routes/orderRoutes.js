const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createOrder,
    getOrders,
    getMyOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder,
    getOrderStats,
    verifyPayment
} = require('../controllers/orderController');

// Public webhook (no auth)
router.post('/verify-payment', verifyPayment);

// Protected routes
router.use(protect);

// User routes
router.get('/my-orders', getMyOrders);
router.post('/', createOrder);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

// Admin only routes
router.use(authorize('admin'));
router.get('/', getOrders);
router.get('/stats/overview', getOrderStats);
router.put('/:id/status', updateOrderStatus);

module.exports = router;