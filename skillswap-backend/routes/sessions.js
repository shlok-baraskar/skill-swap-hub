const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// @route   GET /api/sessions
// @desc    Get all sessions with filters
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { userId, status, type, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Filter by user (teacher or student)
    if (userId) {
      if (type === 'teaching') {
        query.teacher = userId;
      } else if (type === 'learning') {
        query.student = userId;
      } else {
        query.$or = [{ teacher: userId }, { student: userId }];
      }
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    const sessions = await Session.find(query)
      .populate('skill', 'name category')
      .populate('teacher', 'name avatar')
      .populate('student', 'name avatar')
      .sort({ scheduledDate: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Session.countDocuments(query);
    
    res.json({
      success: true,
      count: sessions.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      sessions
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Server error fetching sessions' });
  }
});

// @route   GET /api/sessions/:id
// @desc    Get single session
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('skill')
      .populate('teacher', 'name email avatar phoneNumber')
      .populate('student', 'name email avatar phoneNumber');
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ message: 'Server error fetching session' });
  }
});

// @route   POST /api/sessions
// @desc    Book a new session
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      skillId,
      skillName,
      teacherId,
      studentId,
      scheduledDate,
      duration,
      format,
      price,
      notes,
      meetingLink,
      location
    } = req.body;
    
    // Check if teacher is available at this time
    const conflictingSession = await Session.findOne({
      teacher: teacherId,
      scheduledDate: {
        $gte: new Date(scheduledDate),
        $lt: new Date(new Date(scheduledDate).getTime() + duration * 60000)
      },
      status: { $in: ['scheduled', 'in-progress'] }
    });
    
    if (conflictingSession) {
      return res.status(400).json({ 
        message: 'Teacher is not available at this time' 
      });
    }
    
    const session = await Session.create({
      skill: skillId,
      skillName,
      teacher: teacherId,
      student: studentId,
      scheduledDate,
      duration,
      format,
      price,
      notes,
      meetingLink,
      location,
      payment: {
        status: 'pending',
        amount: price
      }
    });
    
    const populatedSession = await Session.findById(session._id)
      .populate('skill')
      .populate('teacher', 'name email avatar')
      .populate('student', 'name email avatar');
    
    res.status(201).json({
      success: true,
      session: populatedSession
    });
  } catch (error) {
    console.error('Book session error:', error);
    res.status(500).json({ message: 'Server error booking session' });
  }
});

// @route   PUT /api/sessions/:id/complete
// @desc    Mark session as completed
// @access  Private (Teacher)
router.put('/:id/complete', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    if (session.status === 'completed') {
      return res.status(400).json({ message: 'Session already completed' });
    }
    
    session.status = 'completed';
    session.completedAt = new Date();
    await session.save();
    
    res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/sessions/:id/cancel
// @desc    Cancel a session
// @access  Private
router.put('/:id/cancel', async (req, res) => {
  try {
    const { userId, reason } = req.body;
    
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    if (session.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed session' });
    }
    
    session.status = 'cancelled';
    session.cancellation = {
      cancelledBy: userId,
      reason,
      cancelledAt: new Date()
    };
    
    await session.save();
    
    res.json({
      success: true,
      message: 'Session cancelled successfully',
      session
    });
  } catch (error) {
    console.error('Cancel session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/sessions/:id/reschedule
// @desc    Request to reschedule a session
// @access  Private
router.put('/:id/reschedule', async (req, res) => {
  try {
    const { userId, newDate, reason } = req.body;
    
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    session.rescheduling = {
      requestedBy: userId,
      originalDate: session.scheduledDate,
      newDate,
      reason,
      status: 'pending'
    };
    
    await session.save();
    
    res.json({
      success: true,
      message: 'Reschedule request sent',
      session
    });
  } catch (error) {
    console.error('Reschedule session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/sessions/upcoming/:userId
// @desc    Get upcoming sessions for a user
// @access  Private
router.get('/upcoming/:userId', async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [
        { teacher: req.params.userId },
        { student: req.params.userId }
      ],
      scheduledDate: { $gte: new Date() },
      status: 'scheduled'
    })
    .populate('skill', 'name category')
    .populate('teacher', 'name avatar')
    .populate('student', 'name avatar')
    .sort({ scheduledDate: 1 })
    .limit(10);
    
    res.json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    console.error('Get upcoming sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
