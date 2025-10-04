const express = require('express');
const Engineer = require('../models/Engineer');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/engineers
// @desc    Get engineers/contractors directory
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { location, specialty, rating, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    
    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' };
    }
    
    if (specialty) {
      query.specialties = { $in: [specialty] };
    }
    
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    const engineers = await Engineer.find(query)
      .sort({ rating: -1, reviewCount: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password -contactInfo.phone -contactInfo.email');

    const total = await Engineer.countDocuments(query);

    res.json({
      engineers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get engineers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/engineers/:id
// @desc    Get engineer profile
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const engineer = await Engineer.findById(req.params.id)
      .select('-password');

    if (!engineer) {
      return res.status(404).json({ message: 'Engineer not found' });
    }

    res.json({ engineer });
  } catch (error) {
    console.error('Get engineer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/engineers/:id/contact
// @desc    Contact engineer
// @access  Private
router.post('/:id/contact', auth, async (req, res) => {
  try {
    const { message, projectDetails } = req.body;
    
    const engineer = await Engineer.findById(req.params.id);
    if (!engineer) {
      return res.status(404).json({ message: 'Engineer not found' });
    }

    // In a real implementation, you would:
    // 1. Send email notification to engineer
    // 2. Store the contact request in database
    // 3. Set up communication channel
    
    console.log(`Contact request from user ${req.userId} to engineer ${req.params.id}`);
    console.log('Message:', message);
    console.log('Project Details:', projectDetails);

    res.json({
      message: 'Contact request sent successfully',
      engineerId: engineer._id,
      engineerName: engineer.name
    });
  } catch (error) {
    console.error('Contact engineer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/engineers/:id/review
// @desc    Add review for engineer
// @access  Private
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment, projectType } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const engineer = await Engineer.findById(req.params.id);
    if (!engineer) {
      return res.status(404).json({ message: 'Engineer not found' });
    }

    // Check if user already reviewed this engineer
    const existingReview = engineer.reviews.find(
      review => review.user.toString() === req.userId
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this engineer' });
    }

    // Add review
    const review = {
      user: req.userId,
      rating: rating,
      comment: comment,
      projectType: projectType,
      createdAt: new Date()
    };

    engineer.reviews.push(review);
    
    // Update rating and review count
    const totalRating = engineer.reviews.reduce((sum, r) => sum + r.rating, 0);
    engineer.rating = totalRating / engineer.reviews.length;
    engineer.reviewCount = engineer.reviews.length;

    await engineer.save();

    res.json({
      message: 'Review added successfully',
      review: review
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/engineers/:id/portfolio
// @desc    Get engineer's portfolio
// @access  Public
router.get('/:id/portfolio', async (req, res) => {
  try {
    const engineer = await Engineer.findById(req.params.id)
      .select('portfolio name');

    if (!engineer) {
      return res.status(404).json({ message: 'Engineer not found' });
    }

    res.json({
      portfolio: engineer.portfolio,
      engineerName: engineer.name
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/engineers/specialties
// @desc    Get available specialties
// @access  Public
router.get('/specialties', async (req, res) => {
  try {
    const specialties = await Engineer.distinct('specialties');
    res.json({ specialties });
  } catch (error) {
    console.error('Get specialties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/engineers/locations
// @desc    Get available locations
// @access  Public
router.get('/locations', async (req, res) => {
  try {
    const locations = await Engineer.distinct('location.city');
    res.json({ locations });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
