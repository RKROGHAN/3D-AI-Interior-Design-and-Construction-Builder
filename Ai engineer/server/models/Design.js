const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a design name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
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
  floorplan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Floorplan',
    required: true
  },
  type: {
    type: String,
    enum: ['interior', 'exterior', 'landscape', 'furniture', 'lighting', 'color_scheme'],
    required: true
  },
  style: {
    type: String,
    enum: [
      'modern', 'traditional', 'minimalist', 'scandinavian', 'industrial', 
      'bohemian', 'rustic', 'contemporary', 'mediterranean', 'asian', 'custom'
    ],
    required: true
  },
  settings: {
    colorScheme: {
      primary: String,
      secondary: String,
      accent: String,
      neutral: String,
      background: String
    },
    materials: {
      flooring: {
        type: String,
        material: String,
        color: String,
        finish: String
      },
      walls: {
        type: String,
        material: String,
        color: String,
        finish: String
      },
      ceiling: {
        type: String,
        material: String,
        color: String,
        finish: String
      }
    },
    furniture: [{
      id: String,
      type: String,
      name: String,
      brand: String,
      model: String,
      color: String,
      material: String,
      dimensions: {
        width: Number,
        height: Number,
        depth: Number
      },
      position: {
        x: Number,
        y: Number,
        z: Number
      },
      rotation: Number,
      price: Number,
      image: String
    }],
    lighting: {
      ambient: [{
        type: String,
        position: { x: Number, y: Number, z: Number },
        intensity: Number,
        color: String,
        temperature: Number
      }],
      task: [{
        type: String,
        position: { x: Number, y: Number, z: Number },
        intensity: Number,
        color: String,
        temperature: Number
      }],
      accent: [{
        type: String,
        position: { x: Number, y: Number, z: Number },
        intensity: Number,
        color: String,
        temperature: Number
      }]
    },
    decor: [{
      type: String,
      name: String,
      position: { x: Number, y: Number, z: Number },
      size: { width: Number, height: Number },
      color: String,
      material: String,
      image: String
    }],
    plants: [{
      type: String,
      name: String,
      position: { x: Number, y: Number, z: Number },
      size: { width: Number, height: Number },
      careLevel: String,
      lightRequirements: String
    }],
    textures: {
      roughness: Number,
      metalness: Number,
      normal: String,
      displacement: String
    }
  },
  roomSettings: {
    type: Map,
    of: {
      colorScheme: {
        primary: String,
        secondary: String,
        accent: String
      },
      furniture: [mongoose.Schema.Types.Mixed],
      lighting: [mongoose.Schema.Types.Mixed],
      decor: [mongoose.Schema.Types.Mixed]
    }
  },
  costEstimate: {
    total: Number,
    breakdown: {
      furniture: Number,
      lighting: Number,
      materials: Number,
      decor: Number,
      plants: Number
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  images: [{
    url: String,
    type: {
      type: String,
      enum: ['rendering', 'mood_board', 'reference', 'before', 'after']
    },
    room: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  moodBoard: [{
    url: String,
    type: String,
    description: String
  }],
  inspiration: [{
    source: String,
    url: String,
    description: String,
    tags: [String]
  }],
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  shares: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  aiPrompt: String,
  aiModel: String,
  aiConfidence: Number,
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

// Indexes for better query performance
designSchema.index({ user: 1, createdAt: -1 });
designSchema.index({ floorplan: 1 });
designSchema.index({ type: 1, style: 1 });
designSchema.index({ isPublic: 1, isTemplate: 1 });
designSchema.index({ tags: 1 });
designSchema.index({ 'likes.user': 1 });

// Virtual for like count
designSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
designSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Method to add like
designSchema.methods.addLike = function(userId) {
  const existingLike = this.likes.find(like => like.user.toString() === userId.toString());
  if (!existingLike) {
    this.likes.push({ user: userId });
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove like
designSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
  return this.save();
};

// Method to add comment
designSchema.methods.addComment = function(userId, text) {
  this.comments.push({ user: userId, text });
  return this.save();
};

// Method to increment views
designSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to calculate total cost
designSchema.methods.calculateTotalCost = function() {
  let total = 0;
  
  if (this.settings.furniture) {
    total += this.settings.furniture.reduce((sum, item) => sum + (item.price || 0), 0);
  }
  
  if (this.settings.lighting) {
    const lightingItems = [
      ...(this.settings.lighting.ambient || []),
      ...(this.settings.lighting.task || []),
      ...(this.settings.lighting.accent || [])
    ];
    total += lightingItems.reduce((sum, item) => sum + (item.price || 0), 0);
  }
  
  this.costEstimate.total = total;
  return total;
};

// Method to get primary image
designSchema.methods.getPrimaryImage = function() {
  const primaryImage = this.images.find(img => img.isPrimary);
  return primaryImage || this.images[0] || null;
};

// Method to duplicate design
designSchema.methods.duplicate = function(newName) {
  const duplicatedDesign = new Design({
    ...this.toObject(),
    _id: undefined,
    name: newName || `${this.name} (Copy)`,
    isPublic: false,
    isTemplate: false,
    views: 0,
    likes: [],
    comments: [],
    shares: 0,
    downloads: 0,
    version: 1,
    history: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return duplicatedDesign;
};

// Pre-save middleware to update cost estimate
designSchema.pre('save', function(next) {
  if (this.isModified('settings')) {
    this.calculateTotalCost();
  }
  next();
});

// Static method to get popular designs
designSchema.statics.getPopular = function(limit = 10) {
  return this.find({ isPublic: true })
    .sort({ views: -1, likeCount: -1 })
    .limit(limit)
    .populate('user', 'name')
    .populate('floorplan', 'title');
};

// Static method to get designs by style
designSchema.statics.getByStyle = function(style, limit = 20) {
  return this.find({ style, isPublic: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name')
    .populate('floorplan', 'title');
};

// Static method to search designs
designSchema.statics.search = function(query, options = {}) {
  const searchQuery = {
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ],
    isPublic: true
  };
  
  if (options.style) {
    searchQuery.style = options.style;
  }
  
  if (options.type) {
    searchQuery.type = options.type;
  }
  
  return this.find(searchQuery)
    .sort({ createdAt: -1 })
    .limit(options.limit || 20)
    .populate('user', 'name')
    .populate('floorplan', 'title');
};

module.exports = mongoose.model('Design', designSchema);
