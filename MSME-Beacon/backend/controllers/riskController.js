const asyncHandler = require('express-async-handler');
const axios = require('axios');

// FastAPI ML service endpoint
const ML_SERVICE_URL = 'http://localhost:8000/predict';

// @desc    Get current risk score
// @route   GET /api/risk/current
// @access  Private
const getCurrentRisk = asyncHandler(async (req, res) => {
  try {
    // Check if user has business data
    const Business = require('../models/Business');
    const userBusinessData = await Business.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    
    if (!userBusinessData) {
      return res.status(404).json({
        success: false,
        message: 'No business data found. Please complete a risk assessment first.'
      });
    }

    // Return user-specific risk data (this would be calculated based on their actual data)
    res.status(200).json({
      success: true,
      data: {
        score: null, // Will be calculated when user submits prediction form
        category: null,
        lastUpdated: userBusinessData.createdAt,
        trend: null,
        message: 'Complete risk prediction to see your current risk score'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get risk history
// @route   GET /api/risk/history
// @access  Private
const getRiskHistory = asyncHandler(async (req, res) => {
  // Mock data for frontend development
  res.status(200).json([
    { date: '2023-01-01', score: 65, category: 'High Risk' },
    { date: '2023-02-01', score: 68, category: 'Moderate Risk' },
    { date: '2023-03-01', score: 70, category: 'Moderate Risk' },
    { date: '2023-04-01', score: 72, category: 'Moderate Risk' },
    { date: '2023-05-01', score: 75, category: 'Moderate Risk' },
    { date: '2023-06-01', score: 78, category: 'Low Risk' }
  ]);
});

// @desc    Calculate new risk score
// @route   POST /api/risk/calculate
// @access  Private
const calculateRisk = asyncHandler(async (req, res) => {
  // In a real app, this would analyze business data and calculate a risk score
  const { businessData } = req.body;
  
  // Simulated calculation
  const newScore = Math.floor(Math.random() * 20) + 65; // Random score between 65-85
  const category = newScore < 70 ? 'High Risk' : newScore < 80 ? 'Moderate Risk' : 'Low Risk';
  
  res.status(200).json({
    score: newScore,
    category,
    lastUpdated: new Date().toISOString(),
    message: 'Risk score has been recalculated'
  });
});

// @desc    Get risk factors
// @route   GET /api/risk/factors
// @access  Private
const getRiskFactors = asyncHandler(async (req, res) => {
  try {
    // Check if user has business data
    const Business = require('../models/Business');
    const userBusinessData = await Business.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    
    if (!userBusinessData) {
      return res.status(404).json({
        success: false,
        message: 'No business data found. Please complete a risk assessment first.',
        data: []
      });
    }

    // Return empty array or user-specific factors if they exist
    res.status(200).json({
      success: true,
      data: [], // Will be populated when user completes prediction
      message: 'Complete risk prediction to see your risk factors'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get risk trends
// @route   GET /api/risk/trends
// @access  Private
const getRiskTrends = asyncHandler(async (req, res) => {
  try {
    // Check if user has business data
    const Business = require('../models/Business');
    const userBusinessData = await Business.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    
    if (!userBusinessData) {
      return res.status(404).json({
        success: false,
        message: 'No business data found. Please complete a risk assessment first.',
        data: {
          overall: [],
          months: [],
          factors: {}
        }
      });
    }

    // Return empty trends data until user has historical predictions
    res.status(200).json({
      success: true,
      data: {
        overall: [],
        months: [],
        factors: {},
        message: 'Trend data will be available after multiple risk assessments'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Predict risk using ML microservice
// @route   POST /api/risk/predict
// @access  Private
const predictRisk = asyncHandler(async (req, res) => {
  try {
    const businessData = req.body;
    
    console.log('Sending data to ML service:', businessData);
    console.log('ML Service URL:', ML_SERVICE_URL);
    
    // Forward the business data to FastAPI ML service
    const response = await axios.post(ML_SERVICE_URL, businessData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout (reduced for faster fallback)
    });
    
    console.log('ML service response:', response.data);
    
    // Extract risk score and risk level from the ML service response
    const { risk_score, risk_level } = response.data;
    
    // Format response for frontend
    const predictionResult = {
      score: Math.round(risk_score * 100), // Convert to percentage
      category: risk_level,
      riskLevel: risk_level,
      lastUpdated: new Date().toISOString(),
      message: 'Risk prediction completed successfully'
    };
    
    res.status(200).json(predictionResult);
    
  } catch (error) {
    console.error('Error calling ML service:', error.message);
    console.error('Error details:', error.code);
    
    // Handle different types of errors - NO FALLBACK, ONLY REAL ML
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      res.status(503).json({
        error: 'ML service is unavailable',
        message: 'Please make sure your trained ML model service is running on http://localhost:8000',
        details: 'The prediction requires your trained machine learning model to be active'
      });
    } else if (error.code === 'ETIMEDOUT') {
      res.status(408).json({
        error: 'ML service timeout',
        message: 'Your ML model is taking too long to respond',
        details: 'Try again or check if your ML service is overloaded'
      });
    } else if (error.response) {
      // The ML service responded with an error
      res.status(error.response.status).json({
        error: 'ML model error',
        message: 'Your trained model returned an error',
        details: error.response.data
      });
    } else if (error.request) {
      // Network error
      res.status(503).json({
        error: 'Network error',
        message: 'Unable to connect to your ML service',
        details: 'Check if your ML service is running and accessible'
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
});

module.exports = {
  getCurrentRisk,
  getRiskHistory,
  calculateRisk,
  getRiskFactors,
  getRiskTrends,
  predictRisk
}; 