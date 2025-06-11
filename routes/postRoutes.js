const express = require('express');
const { Post, User, SavedPost } = require('../models');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST /posts
// @desc    Create a new post (admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ msg: 'Title and content are required' });
    }
    
    const post = await Post.create({
      title,
      content,
      createdBy: req.user.id
    });
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /posts
// @desc    Get all posts
// @access  Public (değişti: Private -> Public)
router.get('/', async (req, res) => {  // 'protect' middleware'ini kaldırdık
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});


// @route   POST /posts/save/:id
// @desc    Save a post
// @access  Private
router.post('/save/:id', protect, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    
    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Check if already saved
    const existing = await SavedPost.findOne({
      where: { userId, postId }
    });
    
    if (existing) {
      return res.status(400).json({ msg: 'Post already saved' });
    }
    
    // Save the post
    await SavedPost.create({ userId, postId });
    
    res.json({ msg: 'Post saved successfully' });
  } catch (error) {
    console.error('Save post error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /posts/unsave/:id
// @desc    Unsave a post
// @access  Private
router.delete('/unsave/:id', protect, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    
    // Check if saved
    const savedPost = await SavedPost.findOne({
      where: { userId, postId }
    });
    
    if (!savedPost) {
      return res.status(404).json({ msg: 'Saved post not found' });
    }
    
    // Delete the saved post
    await savedPost.destroy();
    
    res.json({ msg: 'Post removed from saved' });
  } catch (error) {
    console.error('Unsave post error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /posts/saved
// @desc    Get user's saved posts
// @access  Private
router.get('/saved', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Post,
          as: 'savedPosts',
          through: { attributes: [] },
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    console.log(`Found ${user.savedPosts?.length || 0} saved posts for user ${userId}`);
    console.log('Saved posts:', JSON.stringify(user.savedPosts));
    res.json(user.savedPosts || []);
  } catch (error) {
    console.error('Get saved posts error:', error);
    res.status(500).json({ msg: 'Server error' , error: error.message});
  }
});

module.exports = router;