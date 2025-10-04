const express = require('express');
const Material = require('../models/Material');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/materials
// @desc    Get materials from marketplace
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      subcategory, 
      brand, 
      priceMin, 
      priceMax, 
      rating, 
      inStock,
      page = 1, 
      limit = 20 
    } = req.query;
    
    // Build query
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (subcategory) {
      query.subcategory = subcategory;
    }
    
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }
    
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = parseFloat(priceMin);
      if (priceMax) query.price.$lte = parseFloat(priceMax);
    }
    
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }
    
    if (inStock === 'true') {
      query.stockQuantity = { $gt: 0 };
    }

    const materials = await Material.find(query)
      .sort({ rating: -1, reviewCount: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Material.countDocuments(query);

    res.json({
      materials,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/materials/:id
// @desc    Get material details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.json({ material });
  } catch (error) {
    console.error('Get material error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/materials/:id/review
// @desc    Add review for material
// @access  Private
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment, projectType } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check if user already reviewed this material
    const existingReview = material.reviews.find(
      review => review.user.toString() === req.userId
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this material' });
    }

    // Add review
    const review = {
      user: req.userId,
      rating: rating,
      comment: comment,
      projectType: projectType,
      createdAt: new Date()
    };

    material.reviews.push(review);
    
    // Update rating and review count
    const totalRating = material.reviews.reduce((sum, r) => sum + r.rating, 0);
    material.rating = totalRating / material.reviews.length;
    material.reviewCount = material.reviews.length;

    await material.save();

    res.json({
      message: 'Review added successfully',
      review: review
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/materials/:id/quote
// @desc    Request quote for material
// @access  Private
router.post('/:id/quote', auth, async (req, res) => {
  try {
    const { quantity, projectDetails, deliveryAddress } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check stock availability
    if (material.stockQuantity < quantity) {
      return res.status(400).json({ 
        message: 'Insufficient stock',
        availableStock: material.stockQuantity
      });
    }

    // In a real implementation, you would:
    // 1. Create a quote request
    // 2. Send notification to supplier
    // 3. Store quote request in database
    
    const quoteRequest = {
      materialId: material._id,
      userId: req.userId,
      quantity: quantity,
      projectDetails: projectDetails,
      deliveryAddress: deliveryAddress,
      requestedAt: new Date(),
      status: 'pending'
    };

    console.log('Quote request:', quoteRequest);

    res.json({
      message: 'Quote request submitted successfully',
      quoteRequest: quoteRequest,
      estimatedPrice: material.price * quantity
    });
  } catch (error) {
    console.error('Request quote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/materials/categories
// @desc    Get available categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Material.distinct('category');
    const subcategories = await Material.distinct('subcategory');
    const brands = await Material.distinct('brand');
    
    res.json({ 
      categories,
      subcategories,
      brands
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/materials/search/suggestions
// @desc    Get search suggestions
// @access  Public
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const suggestions = await Material.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { subcategory: { $regex: q, $options: 'i' } }
      ]
    })
    .select('name brand category subcategory')
    .limit(10);

    res.json({ suggestions });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/materials/compare
// @desc    Compare multiple materials
// @access  Public
router.post('/compare', async (req, res) => {
  try {
    const { materialIds } = req.body;
    
    if (!materialIds || !Array.isArray(materialIds) || materialIds.length < 2) {
      return res.status(400).json({ message: 'At least 2 material IDs are required' });
    }

    if (materialIds.length > 5) {
      return res.status(400).json({ message: 'Maximum 5 materials can be compared' });
    }

    const materials = await Material.find({
      _id: { $in: materialIds }
    });

    if (materials.length !== materialIds.length) {
      return res.status(400).json({ message: 'One or more materials not found' });
    }

    // Create comparison data
    const comparison = {
      materials: materials,
      comparison: {
        priceRange: {
          min: Math.min(...materials.map(m => m.price)),
          max: Math.max(...materials.map(m => m.price))
        },
        ratingRange: {
          min: Math.min(...materials.map(m => m.rating)),
          max: Math.max(...materials.map(m => m.rating))
        },
        categories: [...new Set(materials.map(m => m.category))],
        brands: [...new Set(materials.map(m => m.brand))]
      }
    };

    res.json(comparison);
  } catch (error) {
    console.error('Compare materials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
