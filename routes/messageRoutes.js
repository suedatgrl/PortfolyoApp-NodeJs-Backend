const express = require('express');
const { Message, User } = require('../models');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST /messages
// @desc    Create a new message
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ msg: 'Text is required' });
    }
    
    const message = await Message.create({
      text,
      userId: req.user.id
    });
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /messages
// @desc    Get all messages (admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;