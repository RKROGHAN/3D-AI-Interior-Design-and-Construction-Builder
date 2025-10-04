const mongoose = require('mongoose');

const engineerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  specialties: [{
    type: String,
    enum: [
      'residential', 'commercial', 'industrial', 'renovation', 
      'new_construction', 'interior_design', 'landscape', 
      'structural', 'electrical', 'plumbing', 'hvac'
    ]
  }],
  location: {
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'US'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contactInfo: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    website: String,
    linkedin: String,
    instagram: String
  },
  experience: {
    years: {
      type: Number,
      required: true,
      min: 0
    },
    projectsCompleted: {
      type: Number,
      default: 0
    },
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      expiryDate: Date
    }],
    education: [{
      degree: String,
      institution: String,
      year: Number,
      field: String
    }]
  },
  services: [{
    name: String,
    description: String,
    priceRange: {
      min: Number,
      max: Number
    },
    unit: {
      type: String,
      enum: ['hour', 'project', 'square_foot', 'room']
    }
  }],
  portfolio: [{
    title: String,
    description: String,
    images: [String],
    projectType: String,
    completionDate: Date,
    budget: Number,
    location: String,
    features: [String]
  }],
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
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    projectType: String,
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
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    nextAvailableDate: Date,
    workingHours: {
      start: String,
      end: String,
      timezone: String
    },
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  pricing: {
    consultationFee: Number,
    hourlyRate: Number,
    projectRate: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  insurance: {
    hasInsurance: {
      type: Boolean,
      default: false
    },
    insuranceProvider: String,
    policyNumber: String,
    coverageAmount: Number,
    expiryDate: Date
  },
  license: {
    hasLicense: {
      type: Boolean,
      default: false
    },
    licenseNumber: String,
    issuingAuthority: String,
    issueDate: Date,
    expiryDate: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationDocuments: [{
    type: String,
    url: String,
    uploadedAt: Date
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  profileViews: {
    type: Number,
    default: 0
  },
  contactRequests: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    projectDetails: mongoose.Schema.Types.Mixed,
    requestedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'responded', 'completed'],
      default: 'pending'
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
engineerSchema.index({ 'location.city': 1, 'location.state': 1 });
engineerSchema.index({ specialties: 1 });
engineerSchema.index({ rating: -1, reviewCount: -1 });
engineerSchema.index({ isVerified: 1, isActive: 1 });

// Virtual for full address
engineerSchema.virtual('fullAddress').get(function() {
  return `${this.location.city}, ${this.location.state}, ${this.location.country}`;
});

// Method to update rating
engineerSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.reviewCount = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / this.reviews.length;
    this.reviewCount = this.reviews.length;
  }
};

// Method to check availability
engineerSchema.methods.isAvailable = function() {
  if (!this.availability.isAvailable) {
    return false;
  }
  
  if (this.availability.nextAvailableDate && new Date() < this.availability.nextAvailableDate) {
    return false;
  }
  
  return true;
};

// Method to get average project cost
engineerSchema.methods.getAverageProjectCost = function() {
  if (this.portfolio.length === 0) {
    return 0;
  }
  
  const totalCost = this.portfolio.reduce((sum, project) => sum + (project.budget || 0), 0);
  return totalCost / this.portfolio.length;
};

// Pre-save middleware to update rating
engineerSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    this.updateRating();
  }
  next();
});

module.exports = mongoose.model('Engineer', engineerSchema);
