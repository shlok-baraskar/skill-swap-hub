const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
    maxlength: 1000
  },
  response: {
    text: String,
    respondedAt: Date
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Ensure one review per session
reviewSchema.index({ session: 1, student: 1 }, { unique: true });

// Update ratings after saving review
reviewSchema.post('save', async function(doc) {
  const User = mongoose.model('User');
  const Skill = mongoose.model('Skill');
  
  // Update teacher average rating
  const teacher = await User.findById(doc.teacher);
  if (teacher) {
    await teacher.updateAverageRating();
  }
  
  // Update skill average rating
  const skill = await Skill.findById(doc.skill);
  if (skill) {
    await skill.updateAverageRating();
  }
});

module.exports = mongoose.model('Review', reviewSchema);
