const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a material name'],
    trim: true,
    maxlength: [200, 'Name cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'flooring', 'walls', 'ceiling', 'doors', 'windows', 'kitchen', 
      'bathroom', 'lighting', 'furniture', 'decor', 'hardware', 'paint'
    ]
  },
  subcategory: {
    type: String,
    required: [true, 'Please provide a subcategory']
  },
  brand: {
    type: String,
    required: [true, 'Please provide a brand'],
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR']
  },
  unit: {
    type: String,
    required: [true, 'Please provide a unit'],
    enum: ['piece', 'sq_ft', 'sq_m', 'linear_ft', 'linear_m', 'gallon', 'liter', 'kg', 'lb']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['in', 'ft', 'cm', 'm']
    }
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'lb', 'g', 'oz']
    }
  },
  color: {
    name: String,
    hex: String,
    rgb: {
      r: Number,
      g: Number,
      b: Number
    }
  },
  material: {
    type: String,
    required: [true, 'Please provide material type']
  },
  finish: {
    type: String,
    enum: ['matte', 'glossy', 'semi_gloss', 'textured', 'smooth', 'brushed', 'polished']
  },
  durability: {
    rating: {
      type: Number,
      min: 1,
      max: 10
    },
    warranty: {
      years: Number,
      description: String
    }
  },
  sustainability: {
    ecoFriendly: {
      type: Boolean,
      default: false
    },
    recycledContent: {
      type: Number,
      min: 0,
      max: 100
    },
    certifications: [String],
    carbonFootprint: Number
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  specifications: {
    type: Map,
    of: String
  },
  features: [String],
  applications: [String],
  installation: {
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'professional']
    },
    timeRequired: String,
    toolsRequired: [String],
    instructions: String
  },
  maintenance: {
    frequency: String,
    requirements: [String],
    cleaningInstructions: String
  },
  supplier: {
    name: {
      type: String,
      required: [true, 'Please provide supplier name']
    },
    contact: {
      email: String,
      phone: String,
      website: String
    },
    location: {
      city: String,
      state: String,
      country: String
    }
  },
  stock: {
    quantity: {
      type: Number,
      default: 0,
      min: 0
    },
    minOrderQuantity: {
      type: Number,
      default: 1
    },
    maxOrderQuantity: Number,
    leadTime: {
      type: String,
      default: '1-2 weeks'
    },
    isInStock: {
      type: Boolean,
      default: true
    }
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    shippingClass: String,
    freeShippingThreshold: Number,
    shippingRates: [{
      region: String,
      rate: Number,
      estimatedDays: String
    }]
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: String,
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    projectType: String,
    pros: [String],
    cons: [String],
    verifiedPurchase: {
      type: Boolean,
      default: false
    },
    helpful: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  discount: {
    percentage: {
      type: Number,
      min: 0,
      max: 100
    },
    validFrom: Date,
    validTo: Date,
    description: String
  },
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material'
  }],
  alternatives: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material'
  }],
  compatibility: [{
    product: String,
    compatible: Boolean,
    notes: String
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
materialSchema.index({ category: 1, subcategory: 1 });
materialSchema.index({ brand: 1 });
materialSchema.index({ price: 1 });
materialSchema.index({ rating: -1, reviewCount: -1 });
materialSchema.index({ isActive: 1, isFeatured: 1 });
materialSchema.index({ name: 'text', description: 'text', brand: 'text' });

// Virtual for discounted price
materialSchema.virtual('discountedPrice').get(function() {
  if (this.discount && this.discount.percentage > 0) {
    const now = new Date();
    if (this.discount.validFrom <= now && this.discount.validTo >= now) {
      return this.price * (1 - this.discount.percentage / 100);
    }
  }
  return this.price;
});

// Virtual for availability status
materialSchema.virtual('availabilityStatus').get(function() {
  if (this.stock.quantity === 0) {
    return 'out_of_stock';
  } else if (this.stock.quantity < 10) {
    return 'low_stock';
  } else {
    return 'in_stock';
  }
});

// Method to update rating
materialSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.reviewCount = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / this.reviews.length;
    this.reviewCount = this.reviews.length;
  }
};

// Method to check if in stock
materialSchema.methods.isInStock = function(quantity = 1) {
  return this.stock.quantity >= quantity && this.isActive;
};

// Method to get primary image
materialSchema.methods.getPrimaryImage = function() {
  const primaryImage = this.images.find(img => img.isPrimary);
  return primaryImage || this.images[0] || null;
};

// Method to add review
materialSchema.methods.addReview = function(reviewData) {
  this.reviews.push(reviewData);
  this.updateRating();
  return this.save();
};

// Method to update stock
materialSchema.methods.updateStock = function(quantity) {
  this.stock.quantity = Math.max(0, this.stock.quantity + quantity);
  this.stock.isInStock = this.stock.quantity > 0;
  return this.save();
};

// Pre-save middleware to update rating and stock status
materialSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    this.updateRating();
  }
  
  if (this.isModified('stock.quantity')) {
    this.stock.isInStock = this.stock.quantity > 0;
  }
  
  next();
});

// Static method to get popular materials
materialSchema.statics.getPopular = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ salesCount: -1, rating: -1 })
    .limit(limit);
};

// Static method to get materials by category
materialSchema.statics.getByCategory = function(category, limit = 20) {
  return this.find({ category, isActive: true })
    .sort({ rating: -1, reviewCount: -1 })
    .limit(limit);
};

// Static method to search materials
materialSchema.statics.search = function(query, options = {}) {
  const searchQuery = {
    $text: { $search: query },
    isActive: true
  };
  
  if (options.category) {
    searchQuery.category = options.category;
  }
  
  if (options.priceMin || options.priceMax) {
    searchQuery.price = {};
    if (options.priceMin) searchQuery.price.$gte = options.priceMin;
    if (options.priceMax) searchQuery.price.$lte = options.priceMax;
  }
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(options.limit || 20);
};

module.exports = mongoose.model('Material', materialSchema);
