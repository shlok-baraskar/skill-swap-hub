const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  skillName: {
    type: String,
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
  scheduledDate: {
    type: Date,
    required: [true, 'Please provide a scheduled date']
  },
  duration: {
    type: Number, // in minutes
    required: true,
    default: 60
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },
  format: {
    type: String,
    enum: ['online', 'in-person'],
    required: true
  },
  meetingLink: {
    type: String
  },
  location: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  teacherNotes: {
    type: String,
    maxlength: 1000
  },
  studentNotes: {
    type: String,
    maxlength: 1000
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'completed', 'refunded', 'failed'],
      default: 'pending'
    },
    transactionId: String,
    amount: Number,
    paidAt: Date
  },
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    cancelledAt: Date
  },
  rescheduling: {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    originalDate: Date,
    newDate: Date,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'declined']
    }
  },
  reminder: {
    sent: { type: Boolean, default: false },
    sentAt: Date
  },
  completedAt: Date
}, {
  timestamps: true
});

// Index for queries
sessionSchema.index({ teacher: 1, scheduledDate: 1 });
sessionSchema.index({ student: 1, scheduledDate: 1 });
sessionSchema.index({ status: 1, scheduledDate: 1 });

// Update stats when session is completed
sessionSchema.post('save', async function(doc) {
  if (doc.status === 'completed' && doc.completedAt) {
    const User = mongoose.model('User');
    const Skill = mongoose.model('Skill');
    
    // Update teacher stats
    await User.findByIdAndUpdate(doc.teacher, {
      $inc: { 
        'stats.sessionsTaught': 1,
        'stats.totalEarnings': doc.price
      }
    });
    
    // Update student stats
    await User.findByIdAndUpdate(doc.student, {
      $inc: { 'stats.sessionsTaken': 1 }
    });
    
    // Update skill stats
    await Skill.findByIdAndUpdate(doc.skill, {
      $inc: { 'stats.totalSessions': 1 },
      $addToSet: { 'stats.totalStudents': doc.student }
    });
  }
});

module.exports = mongoose.model('Session', sessionSchema);
