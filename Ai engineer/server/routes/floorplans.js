const express = require('express');
const Floorplan = require('../models/Floorplan');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/floorplans
// @desc    Get user's floorplans
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tags } = req.query;
    const query = { user: req.userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    const floorplans = await Floorplan.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email')
      .populate('collaborators.user', 'name email');

    const total = await Floorplan.countDocuments(query);

    res.json({
      floorplans,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get floorplans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/floorplans/public
// @desc    Get public floorplans and templates
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const { page = 1, limit = 12, type = 'all' } = req.query;
    const query = { isPublic: true };

    if (type === 'templates') {
      query.isTemplate = true;
    } else if (type === 'public') {
      query.isTemplate = false;
    }

    const floorplans = await Floorplan.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name')
      .select('-views -history -collaborators');

    const total = await Floorplan.countDocuments(query);

    res.json({
      floorplans,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get public floorplans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/floorplans/:id
// @desc    Get single floorplan
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const floorplan = await Floorplan.findOne({
      _id: req.params.id,
      $or: [
        { user: req.userId },
        { 'collaborators.user': req.userId }
      ]
    }).populate('user', 'name email').populate('collaborators.user', 'name email');

    if (!floorplan) {
      return res.status(404).json({ message: 'Floorplan not found' });
    }

    res.json({ floorplan });
  } catch (error) {
    console.error('Get floorplan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/floorplans
// @desc    Create new floorplan
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const floorplanData = {
      ...req.body,
      user: req.userId
    };

    const floorplan = new Floorplan(floorplanData);
    await floorplan.save();

    res.status(201).json({
      message: 'Floorplan created successfully',
      floorplan
    });
  } catch (error) {
    console.error('Create floorplan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/floorplans/:id
// @desc    Update floorplan
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const floorplan = await Floorplan.findOne({
      _id: req.params.id,
      $or: [
        { user: req.userId },
        { 'collaborators.user': req.userId, 'collaborators.role': { $in: ['editor', 'admin'] } }
      ]
    });

    if (!floorplan) {
      return res.status(404).json({ message: 'Floorplan not found or access denied' });
    }

    // Add to history
    floorplan.history.push({
      version: floorplan.version + 1,
      changes: req.body.changes || 'Updated floorplan',
      user: req.userId,
      timestamp: new Date()
    });

    // Update floorplan
    Object.assign(floorplan, req.body);
    floorplan.version += 1;
    await floorplan.save();

    res.json({
      message: 'Floorplan updated successfully',
      floorplan
    });
  } catch (error) {
    console.error('Update floorplan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/floorplans/:id
// @desc    Delete floorplan
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const floorplan = await Floorplan.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!floorplan) {
      return res.status(404).json({ message: 'Floorplan not found or access denied' });
    }

    await Floorplan.findByIdAndDelete(req.params.id);

    res.json({ message: 'Floorplan deleted successfully' });
  } catch (error) {
    console.error('Delete floorplan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/floorplans/:id/collaborate
// @desc    Add collaborator to floorplan
// @access  Private
router.post('/:id/collaborate', auth, async (req, res) => {
  try {
    const { email, role } = req.body;
    
    const floorplan = await Floorplan.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!floorplan) {
      return res.status(404).json({ message: 'Floorplan not found or access denied' });
    }

    // Find user by email
    const User = require('../models/User');
    const collaborator = await User.findOne({ email });
    if (!collaborator) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already a collaborator
    const existingCollaborator = floorplan.collaborators.find(
      col => col.user.toString() === collaborator._id.toString()
    );

    if (existingCollaborator) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }

    floorplan.collaborators.push({
      user: collaborator._id,
      role: role || 'viewer'
    });

    await floorplan.save();

    res.json({
      message: 'Collaborator added successfully',
      collaborator: {
        id: collaborator._id,
        name: collaborator.name,
        email: collaborator.email,
        role: role || 'viewer'
      }
    });
  } catch (error) {
    console.error('Add collaborator error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/floorplans/:id/duplicate
// @desc    Duplicate floorplan
// @access  Private
router.post('/:id/duplicate', auth, async (req, res) => {
  try {
    const originalFloorplan = await Floorplan.findOne({
      _id: req.params.id,
      $or: [
        { user: req.userId },
        { isPublic: true }
      ]
    });

    if (!originalFloorplan) {
      return res.status(404).json({ message: 'Floorplan not found' });
    }

    const duplicatedFloorplan = new Floorplan({
      ...originalFloorplan.toObject(),
      _id: undefined,
      title: `${originalFloorplan.title} (Copy)`,
      user: req.userId,
      isPublic: false,
      isTemplate: false,
      collaborators: [],
      version: 1,
      history: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await duplicatedFloorplan.save();

    res.status(201).json({
      message: 'Floorplan duplicated successfully',
      floorplan: duplicatedFloorplan
    });
  } catch (error) {
    console.error('Duplicate floorplan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
