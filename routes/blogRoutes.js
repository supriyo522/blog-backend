const express = require('express');
const Blog = require('../models/Blog');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to protect routes
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Ensure you're splitting to get just the token
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// Create a new blog post
router.post('/create', protect, async (req, res) => {
  const { title, content, media } = req.body;
  const location = req.userLocation || 'Unknown';
  try {
    const blog = new Blog({ title, content, media, author: req.user, location });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch blogs based on location
router.get('/location', async (req, res) => {
  const location = req.userLocation || 'Unknown';
  try {
    const blogs = await Blog.find({ location, isPublished: true });
    res.json(blogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
