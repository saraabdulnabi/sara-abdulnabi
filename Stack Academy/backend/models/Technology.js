const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Technology name is required'],
    trim: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Other'],
    default: 'Other'
  },
  icon: {
    type: String,
    default: 'fa-code'
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Technology', technologySchema);