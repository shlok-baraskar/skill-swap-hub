const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// @route   GET /api/reviews
// @desc    Get reviews with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { skillId, teacherId, studentId, page = 1, limit = 10 } = req.query;
    
    let query = { isVisible: true };
    
    if (skillId) query.skill = skillId;
    if (teacherId) query.teacher = teacherId;
    if (studentId) query.student = studentId;
    
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find(query)
      .populate('student', 'name avatar')
      .populate('skill', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Review.countDocuments(query);
    
    res.json({
      success: true,
      count: reviews.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews/:id
// @desc    Get single review
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('student', 'name avatar')
      .populate('teacher', 'name')
      .populate('skill', 'name');
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      skillId,
      teacherId,
      studentId,
      sessionId,
      rating,
      comment
    } = req.body;
    
    // Check if review already exists for this session
    const existingReview = await Review.findOne({
      session: sessionId,
      student: studentId
    });
    
    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this session' 
      });
    }
    
    const review = await Review.create({
      skill: skillId,
      teacher: teacherId,
      student: studentId,
      session: sessionId,
      rating,
      comment
    });
    
    const populatedReview = await Review.findById(review._id)
      .populate('student', 'name avatar')
      .populate('skill', 'name');
    
    res.status(201).json({
      success: true,
      review: populatedReview
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error creating review' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private (Student who created it)
router.put('/:id', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    let review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    
    await review.save();
    
    review = await Review.findById(review._id)
      .populate('student', 'name avatar')
      .populate('skill', 'name');
    
    res.json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private (Student/Admin)
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    await review.deleteOne();
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id/response
// @desc    Teacher responds to a review
// @access  Private (Teacher)
router.put('/:id/response', async (req, res) => {
  try {
    const { text } = req.body;
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    review.response = {
      text,
      respondedAt: new Date()
    };
    
    await review.save();
    
    res.json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Response to review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.put('/:id/helpful', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Toggle helpful
    const index = review.helpful.indexOf(userId);
    if (index > -1) {
      review.helpful.splice(index, 1);
    } else {
      review.helpful.push(userId);
    }
    
    await review.save();
    
    res.json({
      success: true,
      helpfulCount: review.helpful.length
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
