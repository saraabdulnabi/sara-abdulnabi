const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Course = require('../models/Course');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { paymentMethod, billingDetails } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.course');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Your cart is empty'
            });
        }

        // Calculate totals
        const subtotal = cart.totalPrice;
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + tax;

        // Create order
        const order = await Order.create({
            user: req.user.id,
            items: cart.items.map(item => ({
                course: item.course._id,
                price: item.price,
                discountApplied: item.course.discountPrice ? 
                    (item.course.price - item.course.discountPrice) : 0
            })),
            subtotal,
            tax,
            total,
            paymentMethod,
            billingDetails,
            paymentStatus: 'completed',
            orderStatus: 'processing',
            paymentDetails: {
                paidAt: Date.now(),
                transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`
            }
        });

        // Enroll user in courses
        const user = await User.findById(req.user.id);
        
        for (const item of cart.items) {
            // Check if already enrolled
            const alreadyEnrolled = user.enrolledCourses.some(
                e => e.course.toString() === item.course._id.toString()
            );

            if (!alreadyEnrolled) {
                // Add to enrolled courses
                user.enrolledCourses.push({
                    course: item.course._id,
                    enrolledAt: Date.now(),
                    progress: 0,
                    completed: false
                });

                // Update course student count
                await Course.findByIdAndUpdate(item.course._id, {
                    $inc: { totalStudents: 1 }
                });

                // Update user stats
                user.stats.totalLearningHours += item.course.duration?.hours || 0;
            }
        }

        user.hasEnrolledCourses = user.enrolledCourses.length > 0;
        await user.save();

        // Clear cart
        cart.items = [];
        await cart.save();

        // Populate order with course details
        await order.populate('items.course');
        await order.populate('user', 'firstName lastName email');

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
    try {
        const features = new APIFeatures(
            Order.find().populate('user', 'firstName lastName email'),
            req.query
        )
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const orders = await features.query;

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.course', 'title thumbnail price')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.course')
            .populate('user', 'firstName lastName email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns order or is admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns order
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order'
            });
        }

        // Check if order can be cancelled
        if (order.orderStatus === 'completed' || order.orderStatus === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled because it is ${order.orderStatus}`
            });
        }

        order.orderStatus = 'cancelled';
        order.paymentStatus = 'refunded';
        await order.save();

        // Remove enrolled courses
        const user = await User.findById(req.user.id);
        
        for (const item of order.items) {
            user.enrolledCourses = user.enrolledCourses.filter(
                e => e.course.toString() !== item.course.toString()
            );

            // Decrease course student count
            await Course.findByIdAndUpdate(item.course, {
                $inc: { totalStudents: -1 }
            });
        }

        user.hasEnrolledCourses = user.enrolledCourses.length > 0;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get order statistics (admin)
// @route   GET /api/orders/stats
// @access  Private/Admin
exports.getOrderStats = async (req, res, next) => {
    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$total' },
                    avgOrderValue: { $avg: '$total' },
                    completedOrders: {
                        $sum: { $cond: [{ $eq: ['$orderStatus', 'completed'] }, 1, 0] }
                    },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] }
                    }
                }
            }
        ]);

        // Get daily sales for last 7 days
        const last7Days = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    sales: { $sum: '$total' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                summary: stats[0] || {
                    totalOrders: 0,
                    totalRevenue: 0,
                    avgOrderValue: 0,
                    completedOrders: 0,
                    pendingOrders: 0
                },
                dailySales: last7Days
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify payment (webhook)
// @route   POST /api/orders/verify-payment
// @access  Public (webhook)
exports.verifyPayment = async (req, res, next) => {
    try {
        const { orderId, paymentIntentId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.paymentStatus = 'completed';
        order.orderStatus = 'processing';
        order.paymentDetails = {
            ...order.paymentDetails,
            paymentIntentId,
            paidAt: Date.now()
        };

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully'
        });
    } catch (error) {
        next(error);
    }
};