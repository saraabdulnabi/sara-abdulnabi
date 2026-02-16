const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Specification title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Specification description is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['frontend', 'backend', 'database', 'design', 'feature'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  estimatedHours: Number,
  //  relationship with Project
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Specification', specificationSchema);