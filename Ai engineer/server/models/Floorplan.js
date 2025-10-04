const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  id: String,
  type: {
    type: String,
    enum: ['bedroom', 'living', 'kitchen', 'bathroom', 'dining', 'office', 'storage', 'balcony', 'other'],
    required: true
  },
  name: String,
  dimensions: {
    width: Number,
    height: Number
  },
  position: {
    x: Number,
    y: Number
  },
  walls: [{
    id: String,
    start: { x: Number, y: Number },
    end: { x: Number, y: Number },
    thickness: { type: Number, default: 0.2 },
    height: { type: Number, default: 2.5 }
  }],
  doors: [{
    id: String,
    position: { x: Number, y: Number },
    width: { type: Number, default: 0.9 },
    height: { type: Number, default: 2.1 },
    type: { type: String, enum: ['single', 'double', 'sliding'], default: 'single' }
  }],
  windows: [{
    id: String,
    position: { x: Number, y: Number },
    width: { type: Number, default: 1.2 },
    height: { type: Number, default: 1.5 },
    type: { type: String, enum: ['standard', 'bay', 'casement'], default: 'standard' }
  }],
  furniture: [{
    id: String,
    type: String,
    name: String,
    position: { x: Number, y: Number },
    dimensions: { width: Number, height: Number, depth: Number },
    rotation: { type: Number, default: 0 },
    material: String,
    color: String,
    model: String
  }]
});

const floorplanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    units: { type: String, enum: ['meters', 'feet'], default: 'meters' }
  },
  rooms: [roomSchema],
  metadata: {
    totalArea: Number,
    roomCount: Number,
    floorCount: { type: Number, default: 1 },
    buildingType: {
      type: String,
      enum: ['residential', 'commercial', 'industrial', 'mixed'],
      default: 'residential'
    }
  },
  design: {
    style: {
      type: String,
      enum: ['modern', 'traditional', 'minimalist', 'scandinavian', 'industrial', 'bohemian', 'custom'],
      default: 'modern'
    },
    colorScheme: {
      primary: { type: String, default: '#ffffff' },
      secondary: { type: String, default: '#f5f5f5' },
      accent: { type: String, default: '#007bff' }
    },
    materials: {
      flooring: String,
      walls: String,
      ceiling: String
    },
    lighting: {
      natural: Number,
      artificial: Number,
      energyEfficient: Boolean
    }
  },
  aiSuggestions: [{
    type: String,
    suggestion: String,
    confidence: Number,
    applied: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  costEstimate: {
    total: Number,
    breakdown: {
      materials: Number,
      labor: Number,
      furniture: Number,
      fixtures: Number
    },
    currency: { type: String, default: 'USD' },
    lastUpdated: Date
  },
  sustainability: {
    score: { type: Number, min: 0, max: 100 },
    factors: {
      energyEfficiency: Number,
      materialSustainability: Number,
      waterConservation: Number,
      wasteReduction: Number
    }
  },
  compliance: {
    buildingCodes: [String],
    zoning: [String],
    accessibility: Boolean,
    fireSafety: Boolean
  },
  views: {
    '2d': {
      data: mongoose.Schema.Types.Mixed,
      lastUpdated: Date
    },
    '3d': {
      data: mongoose.Schema.Types.Mixed,
      lastUpdated: Date
    },
    '360': {
      panoramas: [String],
      hotspots: [mongoose.Schema.Types.Mixed],
      lastUpdated: Date
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  tags: [String],
  version: {
    type: Number,
    default: 1
  },
  history: [{
    version: Number,
    changes: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Calculate total area before saving
floorplanSchema.pre('save', function(next) {
  if (this.rooms && this.rooms.length > 0) {
    this.metadata.totalArea = this.rooms.reduce((total, room) => {
      return total + (room.dimensions.width * room.dimensions.height);
    }, 0);
    this.metadata.roomCount = this.rooms.length;
  }
  next();
});

// Index for better query performance
floorplanSchema.index({ user: 1, createdAt: -1 });
floorplanSchema.index({ isPublic: 1, isTemplate: 1 });
floorplanSchema.index({ tags: 1 });

module.exports = mongoose.model('Floorplan', floorplanSchema);
