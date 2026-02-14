const express = require('express');
const router = express.Router();
const Discussion = require('../models/Discussion');

// @route   GET /api/community/discussions
// @desc    Get all discussions with filters
// @access  Public
router.get('/discussions', async (req, res) => {
  try {
    const { category, search, sort = 'recent', page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    // Sorting
    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { views: -1, 'likes': -1 };
        break;
      case 'recent':
        sortOption = { lastActivity: -1 };
        break;
      case 'unanswered':
        query['replies.0'] = { $exists: false };
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    const skip = (page - 1) * limit;
    
    const discussions = await Discussion.find(query)
      .populate('author', 'name avatar')
      .populate('replies.author', 'name avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Discussion.countDocuments(query);
    
    res.json({
      success: true,
      count: discussions.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      discussions
    });
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/community/discussions/:id
// @desc    Get single discussion
// @access  Public
router.get('/discussions/:id', async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('author', 'name avatar bio')
      .populate('replies.author', 'name avatar');
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    // Increment views
    discussion.views += 1;
    await discussion.save();
    
    res.json({
      success: true,
      discussion
    });
  } catch (error) {
    console.error('Get discussion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/community/discussions
// @desc    Create a new discussion
// @access  Private
router.post('/discussions', async (req, res) => {
  try {
    const { title, content, authorId, category, tags } = req.body;
    
    const discussion = await Discussion.create({
      title,
      content,
      author: authorId,
      category,
      tags
    });
    
    const populatedDiscussion = await Discussion.findById(discussion._id)
      .populate('author', 'name avatar');
    
    res.status(201).json({
      success: true,
      discussion: populatedDiscussion
    });
  } catch (error) {
    console.error('Create discussion error:', error);
    res.status(500).json({ message: 'Server error creating discussion' });
  }
});

// @route   POST /api/community/discussions/:id/replies
// @desc    Add a reply to discussion
// @access  Private
router.post('/discussions/:id/replies', async (req, res) => {
  try {
    const { authorId, content } = req.body;
    
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    if (discussion.isClosed) {
      return res.status(400).json({ message: 'Discussion is closed' });
    }
    
    discussion.replies.push({
      author: authorId,
      content,
      createdAt: new Date()
    });
    
    await discussion.save();
    
    const updatedDiscussion = await Discussion.findById(discussion._id)
      .populate('author', 'name avatar')
      .populate('replies.author', 'name avatar');
    
    res.json({
      success: true,
      discussion: updatedDiscussion
    });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/community/discussions/:id/like
// @desc    Like/unlike a discussion
// @access  Private
router.put('/discussions/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    const index = discussion.likes.indexOf(userId);
    if (index > -1) {
      discussion.likes.splice(index, 1);
    } else {
      discussion.likes.push(userId);
    }
    
    await discussion.save();
    
    res.json({
      success: true,
      likesCount: discussion.likes.length,
      isLiked: index === -1
    });
  } catch (error) {
    console.error('Like discussion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/community/discussions/:discussionId/replies/:replyId/like
// @desc    Like/unlike a reply
// @access  Private
router.put('/discussions/:discussionId/replies/:replyId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const discussion = await Discussion.findById(req.params.discussionId);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    const reply = discussion.replies.id(req.params.replyId);
    
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }
    
    const index = reply.likes.indexOf(userId);
    if (index > -1) {
      reply.likes.splice(index, 1);
    } else {
      reply.likes.push(userId);
    }
    
    await discussion.save();
    
    res.json({
      success: true,
      likesCount: reply.likes.length,
      isLiked: index === -1
    });
  } catch (error) {
    console.error('Like reply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/community/trending
// @desc    Get trending topics
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const discussions = await Discussion.aggregate([
      {
        $project: {
          title: 1,
          category: 1,
          replyCount: { $size: '$replies' },
          likesCount: { $size: '$likes' },
          views: 1,
          score: {
            $add: [
              { $size: '$replies' },
              { $multiply: [{ $size: '$likes' }, 2] },
              { $divide: ['$views', 10] }
            ]
          }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      success: true,
      trending: discussions
    });
  } catch (error) {
    console.error('Get trending error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/community/discussions/:id
// @desc    Delete a discussion
// @access  Private (Author/Admin)
router.delete('/discussions/:id', async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    await discussion.deleteOne();
    
    res.json({
      success: true,
      message: 'Discussion deleted successfully'
    });
  } catch (error) {
    console.error('Delete discussion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
