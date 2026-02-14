const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a skill name'],
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'technology',
      'creative',
      'business',
      'languages',
      'lifestyle',
      'music',
      'fitness',
      'cooking',
      'academic',
      'other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: 1000
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacherName: {
    type: String,
    required: true
  },
  teacherAvatar: {
    type: String
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
    default: 'all-levels'
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0
  },
  format: {
    online: { type: Boolean, default: true },
    inPerson: { type: Boolean, default: false },
    oneOnOne: { type: Boolean, default: true },
    group: { type: Boolean, default: false }
  },
  maxStudents: {
    type: Number,
    default: 1
  },
  prerequisites: [{
    type: String
  }],
  whatYouWillLearn: [{
    type: String
  }],
  materials: [{
    type: String
  }],
  images: [{
    type: String
  }],
  videoUrl: {
    type: String
  },
  tags: [{
    type: String
  }],
  // Stats
  stats: {
    totalSessions: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search
skillSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Update average rating
skillSchema.methods.updateAverageRating = async function() {
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    { $match: { skillId: this._id } },
    { $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  if (stats.length > 0) {
    this.stats.averageRating = Math.round(stats[0].averageRating * 10) / 10;
    this.stats.totalReviews = stats[0].count;
    await this.save();
  }
};

module.exports = mongoose.model('Skill', skillSchema);
