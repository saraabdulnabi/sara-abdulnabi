const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Web Layout', 'JS Logic', 'UI Design', 'Clean Architecture', 'Full Stack'],
    required: true
  },
  image: {
    type: String,
    default: 'fa-laptop-code'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'in-progress'],
    default: 'active'
  },
  technologies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology'
  }],
  githubUrl: String,
  liveUrl: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field to connect with specifications
projectSchema.virtual('specifications', {
  ref: 'Specification',
  localField: '_id',
  foreignField: 'projectId',
  justOne: false
});

module.exports = mongoose.model('Project', projectSchema);