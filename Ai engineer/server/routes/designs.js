const express = require('express');
const Design = require('../models/Design');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/designs
// @desc    Get user's designs
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, style } = req.query;
    const query = { user: req.userId };

    if (type) {
      query.type = type;
    }

    if (style) {
      query.style = style;
    }

    const designs = await Design.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email')
      .populate('floorplan', 'title');

    const total = await Design.countDocuments(query);

    res.json({
      designs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get designs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/designs/:id
// @desc    Get single design
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const design = await Design.findOne({
      _id: req.params.id,
      user: req.userId
    }).populate('user', 'name email').populate('floorplan', 'title');

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    res.json({ design });
  } catch (error) {
    console.error('Get design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/designs
// @desc    Create new design
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const designData = {
      ...req.body,
      user: req.userId
    };

    const design = new Design(designData);
    await design.save();

    res.status(201).json({
      message: 'Design created successfully',
      design
    });
  } catch (error) {
    console.error('Create design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/designs/:id
// @desc    Update design
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const design = await Design.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    Object.assign(design, req.body);
    await design.save();

    res.json({
      message: 'Design updated successfully',
      design
    });
  } catch (error) {
    console.error('Update design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/designs/:id
// @desc    Delete design
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const design = await Design.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    await Design.findByIdAndDelete(req.params.id);

    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    console.error('Delete design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/designs/:id/apply
// @desc    Apply design to floorplan
// @access  Private
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const { floorplanId } = req.body;
    
    const design = await Design.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    const Floorplan = require('../models/Floorplan');
    const floorplan = await Floorplan.findOne({
      _id: floorplanId,
      user: req.userId
    });

    if (!floorplan) {
      return res.status(404).json({ message: 'Floorplan not found' });
    }

    // Apply design to floorplan
    floorplan.design = {
      ...floorplan.design,
      ...design.settings
    };

    await floorplan.save();

    res.json({
      message: 'Design applied successfully',
      floorplan
    });
  } catch (error) {
    console.error('Apply design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/designs/:id/duplicate
// @desc    Duplicate design
// @access  Private
router.post('/:id/duplicate', auth, async (req, res) => {
  try {
    const originalDesign = await Design.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!originalDesign) {
      return res.status(404).json({ message: 'Design not found' });
    }

    const duplicatedDesign = new Design({
      ...originalDesign.toObject(),
      _id: undefined,
      name: `${originalDesign.name} (Copy)`,
      user: req.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await duplicatedDesign.save();

    res.status(201).json({
      message: 'Design duplicated successfully',
      design: duplicatedDesign
    });
  } catch (error) {
    console.error('Duplicate design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/designs/templates
// @desc    Get design templates
// @access  Public
router.get('/templates', async (req, res) => {
  try {
    const { style, type, limit = 20 } = req.query;
    const query = { isTemplate: true };

    if (style) {
      query.style = style;
    }

    if (type) {
      query.type = type;
    }

    const templates = await Design.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .populate('user', 'name')
      .select('-settings');

    res.json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/designs/:id/save-as-template
// @desc    Save design as template
// @access  Private
router.post('/:id/save-as-template', auth, async (req, res) => {
  try {
    const design = await Design.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    design.isTemplate = true;
    design.isPublic = true;
    await design.save();

    res.json({
      message: 'Design saved as template successfully',
      design
    });
  } catch (error) {
    console.error('Save as template error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
