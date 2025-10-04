const express = require('express');
const OpenAI = require('openai');
const auth = require('../middleware/auth');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @route   POST /api/ai/suggestions
// @desc    Generate AI suggestions for floorplan optimization
// @access  Private
router.post('/suggestions', auth, async (req, res) => {
  try {
    const { floorplanData, prompt } = req.body;

    if (!floorplanData) {
      return res.status(400).json({ message: 'Floorplan data is required' });
    }

    // Analyze floorplan and generate suggestions
    const suggestions = await generateFloorplanSuggestions(floorplanData, prompt);

    res.json({
      suggestions,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('AI suggestions error:', error);
    res.status(500).json({ message: 'Failed to generate AI suggestions' });
  }
});

// @route   POST /api/ai/interior-design
// @desc    Generate interior design suggestions
// @access  Private
router.post('/interior-design', auth, async (req, res) => {
  try {
    const { roomData, style, referenceImage } = req.body;

    if (!roomData) {
      return res.status(400).json({ message: 'Room data is required' });
    }

    // Generate interior design suggestions
    const designSuggestions = await generateInteriorDesign(roomData, style, referenceImage);

    res.json({
      design: designSuggestions,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Interior design error:', error);
    res.status(500).json({ message: 'Failed to generate interior design' });
  }
});

// @route   POST /api/ai/cost-estimate
// @desc    Calculate cost estimate for floorplan
// @access  Private
router.post('/cost-estimate', auth, async (req, res) => {
  try {
    const { floorplanData, settings } = req.body;

    if (!floorplanData) {
      return res.status(400).json({ message: 'Floorplan data is required' });
    }

    // Calculate cost estimate
    const costEstimate = await calculateCostEstimate(floorplanData, settings);

    res.json({
      estimate: costEstimate,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Cost estimate error:', error);
    res.status(500).json({ message: 'Failed to calculate cost estimate' });
  }
});

// @route   POST /api/ai/apply-suggestion
// @desc    Apply AI suggestion to floorplan
// @access  Private
router.post('/apply-suggestion', auth, async (req, res) => {
  try {
    const { floorplanId, suggestionId, changes } = req.body;

    // Apply the suggestion to the floorplan
    const updatedFloorplan = await applySuggestionToFloorplan(floorplanId, suggestionId, changes);

    res.json({
      message: 'Suggestion applied successfully',
      floorplan: updatedFloorplan
    });
  } catch (error) {
    console.error('Apply suggestion error:', error);
    res.status(500).json({ message: 'Failed to apply suggestion' });
  }
});

// Helper functions
async function generateFloorplanSuggestions(floorplanData, prompt) {
  try {
    const systemPrompt = `You are an expert architect and interior designer. Analyze the provided floorplan data and generate helpful suggestions for optimization, layout improvements, and design enhancements.

Floorplan Data: ${JSON.stringify(floorplanData)}
User Prompt: ${prompt || 'Please analyze this floorplan and provide optimization suggestions'}

Provide suggestions in the following format:
1. Layout Optimization
2. Space Utilization
3. Furniture Placement
4. Lighting Design
5. Color Scheme
6. Material Recommendations

Each suggestion should include:
- Title
- Description
- Impact (High/Medium/Low)
- Implementation Difficulty (Easy/Medium/Hard)
- Estimated Cost Impact (Positive/Negative/Neutral)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Please analyze this floorplan and provide detailed suggestions." }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const suggestions = parseAISuggestions(completion.choices[0].message.content);
    return suggestions;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Return mock suggestions if API fails
    return generateMockSuggestions();
  }
}

async function generateInteriorDesign(roomData, style, referenceImage) {
  try {
    const systemPrompt = `You are an expert interior designer. Based on the room data and style preferences, generate detailed interior design recommendations.

Room Data: ${JSON.stringify(roomData)}
Style: ${style || 'Modern'}
Reference Image: ${referenceImage ? 'User provided reference image' : 'No reference image'}

Provide recommendations for:
1. Color Palette
2. Furniture Selection
3. Lighting Plan
4. Material Choices
5. Decorative Elements
6. Layout Optimization

Each recommendation should include specific products, colors, and placement suggestions.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Please provide detailed interior design recommendations." }
      ],
      max_tokens: 1200,
      temperature: 0.8
    });

    const design = parseInteriorDesign(completion.choices[0].message.content);
    return design;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return generateMockInteriorDesign(style);
  }
}

async function calculateCostEstimate(floorplanData, settings) {
  try {
    // Extract room data
    const rooms = floorplanData?.objects?.filter(obj => obj.roomType) || [];
    
    // Calculate areas and costs
    let totalArea = 0;
    let roomCosts = {};
    
    rooms.forEach(room => {
      const area = (room.width || 4) * (room.height || 3);
      totalArea += area;
      
      // Base cost per square meter/foot
      const baseCostPerSqUnit = settings?.region === 'us' ? 150 : 120;
      const qualityMultiplier = {
        'budget': 0.7,
        'standard': 1.0,
        'premium': 1.5,
        'luxury': 2.0
      }[settings?.quality] || 1.0;
      
      const roomCost = area * baseCostPerSqUnit * qualityMultiplier;
      roomCosts[room.roomType] = (roomCosts[room.roomType] || 0) + roomCost;
    });
    
    // Calculate detailed breakdown
    const materialsCost = totalArea * 80 * (settings?.quality === 'luxury' ? 1.8 : settings?.quality === 'premium' ? 1.4 : 1.0);
    const laborCost = totalArea * 60 * (settings?.region === 'us' ? 1.2 : 1.0);
    const furnitureCost = settings?.includeFurniture ? totalArea * 40 : 0;
    const appliancesCost = settings?.includeAppliances ? totalArea * 30 : 0;
    const lightingCost = settings?.includeLighting ? totalArea * 15 : 0;
    const fixturesCost = totalArea * 25;
    const permitsCost = totalArea * 5;
    const contingencyCost = (materialsCost + laborCost) * 0.1;
    
    const totalCost = materialsCost + laborCost + furnitureCost + appliancesCost + 
                     lightingCost + fixturesCost + permitsCost + contingencyCost;
    
    return {
      total: totalCost,
      breakdown: {
        materials: materialsCost,
        labor: laborCost,
        furniture: furnitureCost,
        appliances: appliancesCost,
        lighting: lightingCost,
        fixtures: fixturesCost,
        permits: permitsCost,
        contingency: contingencyCost
      },
      roomCosts,
      totalArea,
      currency: settings?.currency || 'USD',
      quality: settings?.quality || 'standard',
      region: settings?.region || 'us',
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Cost calculation error:', error);
    throw error;
  }
}

async function applySuggestionToFloorplan(floorplanId, suggestionId, changes) {
  try {
    const Floorplan = require('../models/Floorplan');
    
    const floorplan = await Floorplan.findById(floorplanId);
    if (!floorplan) {
      throw new Error('Floorplan not found');
    }

    // Apply the changes to the floorplan
    Object.assign(floorplan, changes);
    floorplan.version += 1;
    
    // Add to history
    floorplan.history.push({
      version: floorplan.version,
      changes: `Applied AI suggestion: ${suggestionId}`,
      user: req.userId,
      timestamp: new Date()
    });

    await floorplan.save();
    return floorplan;
  } catch (error) {
    console.error('Apply suggestion error:', error);
    throw error;
  }
}

function parseAISuggestions(aiResponse) {
  // Parse AI response into structured suggestions
  const suggestions = [];
  
  // Mock parsing - in real implementation, parse the AI response
  suggestions.push({
    id: 'layout_opt_1',
    type: 'layout_optimization',
    title: 'Improve Living Room Flow',
    description: 'Consider repositioning the sofa to create better traffic flow and conversation areas.',
    impact: 'High',
    difficulty: 'Medium',
    costImpact: 'Positive',
    confidence: 0.85
  });

  suggestions.push({
    id: 'furniture_1',
    type: 'furniture_placement',
    title: 'Add Storage Solutions',
    description: 'Incorporate built-in storage units to maximize space utilization.',
    impact: 'Medium',
    difficulty: 'Hard',
    costImpact: 'Negative',
    confidence: 0.75
  });

  return suggestions;
}

function parseInteriorDesign(aiResponse) {
  // Parse AI response into structured design recommendations
  return {
    colorPalette: {
      primary: '#3B82F6',
      secondary: '#F3F4F6',
      accent: '#10B981'
    },
    furniture: [
      { type: 'sofa', style: 'Modern Sectional', color: 'Navy Blue' },
      { type: 'coffee_table', style: 'Glass Top', material: 'Wood & Glass' },
      { type: 'dining_table', style: 'Farmhouse', seats: 6 }
    ],
    lighting: {
      ambient: 'Recessed LED lights',
      task: 'Pendant lights over dining area',
      accent: 'Floor lamps for reading corners'
    },
    materials: {
      flooring: 'Hardwood Oak',
      walls: 'Semi-gloss paint',
      countertops: 'Quartz'
    }
  };
}

function generateMockSuggestions() {
  return [
    {
      id: 'mock_1',
      type: 'layout_optimization',
      title: 'Optimize Kitchen Layout',
      description: 'Consider moving the refrigerator to improve workflow efficiency.',
      impact: 'High',
      difficulty: 'Medium',
      costImpact: 'Neutral',
      confidence: 0.8
    }
  ];
}

function generateMockInteriorDesign(style) {
  const styles = {
    modern: {
      colorPalette: { primary: '#000000', secondary: '#FFFFFF', accent: '#FF6B6B' },
      furniture: [{ type: 'sofa', style: 'Minimalist', color: 'Black' }]
    },
    traditional: {
      colorPalette: { primary: '#8B4513', secondary: '#F5F5DC', accent: '#DAA520' },
      furniture: [{ type: 'sofa', style: 'Classic', color: 'Brown' }]
    }
  };

  return styles[style] || styles.modern;
}

module.exports = router;
