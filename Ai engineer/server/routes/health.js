const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// @route   GET /health
// @desc    Health check endpoint
// @access  Public
router.get('/', async (req, res) => {
  try {
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {}
    };

    // Check database connection
    try {
      await mongoose.connection.db.admin().ping();
      healthCheck.services.database = 'OK';
    } catch (error) {
      healthCheck.services.database = 'ERROR';
      healthCheck.status = 'DEGRADED';
    }

    // Check memory usage
    const memUsage = process.memoryUsage();
    healthCheck.memory = {
      used: Math.round(memUsage.heapUsed / 1024 / 1024),
      total: Math.round(memUsage.heapTotal / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024)
    };

    // Check CPU usage
    const cpuUsage = process.cpuUsage();
    healthCheck.cpu = {
      user: cpuUsage.user,
      system: cpuUsage.system
    };

    const statusCode = healthCheck.status === 'OK' ? 200 : 503;
    res.status(statusCode).json(healthCheck);
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// @route   GET /health/ready
// @desc    Readiness check endpoint
// @access  Public
router.get('/ready', async (req, res) => {
  try {
    // Check if all required services are ready
    const checks = {
      database: false,
      redis: false
    };

    // Check database
    try {
      await mongoose.connection.db.admin().ping();
      checks.database = true;
    } catch (error) {
      console.error('Database check failed:', error);
    }

    // Check Redis (if configured)
    // This would require redis client setup
    checks.redis = true; // Assume Redis is available for now

    const isReady = Object.values(checks).every(check => check === true);

    if (isReady) {
      res.status(200).json({
        status: 'READY',
        timestamp: new Date().toISOString(),
        checks
      });
    } else {
      res.status(503).json({
        status: 'NOT_READY',
        timestamp: new Date().toISOString(),
        checks
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// @route   GET /health/live
// @desc    Liveness check endpoint
// @access  Public
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'ALIVE',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;
