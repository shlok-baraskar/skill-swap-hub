const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const User = require('../models/User');

// @route   GET /api/skills
// @desc    Get all skills with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, level, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    
    let query = { isActive: true };
    
    // Apply filters
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (level) {
      query.level = level;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Sorting
    let sortOption = {};
    switch (sort) {
      case 'price-asc':
        sortOption.price = 1;
        break;
      case 'price-desc':
        sortOption.price = -1;
        break;
      case 'rating':
        sortOption['stats.averageRating'] = -1;
        break;
      case 'popular':
        sortOption['stats.totalSessions'] = -1;
        break;
      default:
        sortOption.createdAt = -1;
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    const skills = await Skill.find(query)
      .populate('teacher', 'name avatar stats.averageRating')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Skill.countDocuments(query);
    
    res.json({
      success: true,
      count: skills.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      skills
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Server error fetching skills' });
  }
});

// @route   GET /api/skills/:id
// @desc    Get single skill by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('teacher', 'name avatar bio stats');
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.json({
      success: true,
      skill
    });
  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({ message: 'Server error fetching skill' });
  }
});

// @route   POST /api/skills
// @desc    Create a new skill
// @access  Private (Teachers only)
router.post('/', async (req, res) => {
  try {
    // In a real app, you'd verify the JWT token here
    const {
      name,
      category,
      description,
      level,
      duration,
      price,
      format,
      teacherId,
      prerequisites,
      whatYouWillLearn,
      materials,
      tags
    } = req.body;
    
    // Get teacher info
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    const skill = await Skill.create({
      name,
      category,
      description,
      level,
      duration,
      price,
      format,
      teacher: teacherId,
      teacherName: teacher.name,
      teacherAvatar: teacher.avatar,
      prerequisites,
      whatYouWillLearn,
      materials,
      tags
    });
    
    // Add skill to teacher's skillsTeaching array
    await User.findByIdAndUpdate(teacherId, {
      $push: {
        skillsTeaching: {
          skillId: skill._id,
          skillName: skill.name,
          category: skill.category
        }
      }
    });
    
    res.status(201).json({
      success: true,
      skill
    });
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ message: 'Server error creating skill' });
  }
});

// @route   PUT /api/skills/:id
// @desc    Update a skill
// @access  Private (Teacher/Admin)
router.put('/:id', async (req, res) => {
  try {
    let skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      skill
    });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ message: 'Server error updating skill' });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete a skill
// @access  Private (Teacher/Admin)
router.delete('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    await skill.deleteOne();
    
    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ message: 'Server error deleting skill' });
  }
});

// @route   GET /api/skills/category/:category
// @desc    Get skills by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const skills = await Skill.find({ 
      category: req.params.category,
      isActive: true 
    })
    .populate('teacher', 'name avatar stats.averageRating')
    .sort({ 'stats.averageRating': -1 });
    
    res.json({
      success: true,
      count: skills.length,
      skills
    });
  } catch (error) {
    console.error('Get category skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
