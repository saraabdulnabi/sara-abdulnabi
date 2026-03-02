const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    comment: {
        type: String,
        required: true,
        maxlength: 500
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: false
    },
    helpful: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    reported: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isApproved: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Ensure one review per user per course
reviewSchema.index({ user: 1, course: 1 }, { unique: true });

// Update course rating when review is saved
reviewSchema.statics.calcAverageRating = async function(courseId) {
    const stats = await this.aggregate([
        {
            $match: { course: courseId, isApproved: true }
        },
        {
            $group: {
                _id: '$course',
                avgRating: { $avg: '$rating' },
                numRatings: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model('Course').findByIdAndUpdate(courseId, {
            rating: stats[0].avgRating.toFixed(1),
            totalRatings: stats[0].numRatings
        });
    } else {
        await mongoose.model('Course').findByIdAndUpdate(courseId, {
            rating: 0,
            totalRatings: 0
        });
    }
};

reviewSchema.post('save', function() {
    this.constructor.calcAverageRating(this.course);
});

reviewSchema.post('remove', function() {
    this.constructor.calcAverageRating(this.course);
});

module.exports = mongoose.model('Review', reviewSchema);