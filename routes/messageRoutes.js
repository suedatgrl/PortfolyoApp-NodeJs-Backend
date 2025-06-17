const express = require('express');
const { Message, User } = require('../models');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST /messages
// @desc    Create a new message
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    // Eğer AuthContext'ten gelen user varsa, name ve email'i otomatik olarak doldur
    const name = req.user?.name || req.body.name;
    const email = req.user?.email || req.body.email;
    const { subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ msg: 'Tüm alanlar zorunludur.' });
    }
    const newMsg = await Message.create({
      name,
      email,
      subject,
      message,
      userId: req.user.id
    });
    res.status(201).json(newMsg);
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