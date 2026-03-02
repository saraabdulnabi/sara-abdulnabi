const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
        minlength: [20, 'Description must be at least 20 characters']
    },
    shortDescription: {
        type: String,
        maxlength: [200, 'Short description cannot exceed 200 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'Frontend Development',
            'Backend Development',
            'Full Stack Development',
            'Database',
            'DevOps',
            'Mobile Development',
            'Data Science',
            'UI/UX Design'
        ]
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
        default: 'All Levels'
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    discountPrice: {
        type: Number,
        min: [0, 'Discount price cannot be negative'],
        validate: {
            validator: function(value) {
                return value < this.price;
            },
            message: 'Discount price must be less than regular price'
        }
    },
    currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'GBP', 'JOD']
    },
    duration: {
        hours: {
            type: Number,
            required: true,
            min: 1
        },
        weeks: {
            type: Number,
            required: true,
            min: 1
        }
    },
    thumbnail: {
        type: String,
        required: [true, 'Course thumbnail is required']
    },
    previewVideo: String,
    curriculum: [{
        section: {
            type: String,
            required: true
        },
        lessons: [{
            title: {
                type: String,
                required: true
            },
            duration: {
                type: String,
                required: true
            },
            video: String,
            isFree: {
                type: Boolean,
                default: false
            },
            order: Number
        }],
        order: Number
    }],
    requirements: [String],
    whatYouWillLearn: [String],
    targetAudience: [String],
    tags: [String],
    language: {
        type: String,
        default: 'English'
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    totalStudents: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    isBestseller: {
        type: Boolean,
        default: false
    },
    isHot: {
        type: Boolean,
        default: false
    },
    isNew: {
        type: Boolean,
        default: true
    },
    publishedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate for reviews
courseSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'course'
});

// Create slug from title
courseSchema.pre('save', function(next) {
    this.slug = this.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    
    if (this.isNew) {
        this.isNew = true;
    } else {
        this.isNew = false;
    }
    
    this.updatedAt = Date.now();
    next();
});

// Update isNew flag after 30 days
courseSchema.pre('save', function(next) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (this.createdAt < thirtyDaysAgo) {
        this.isNew = false;
    }
    next();
});

module.exports = mongoose.model('Course', courseSchema);