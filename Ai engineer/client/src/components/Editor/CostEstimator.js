import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const EstimatorContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
`;

const EstimatorHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
`;

const EstimatorTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
`;

const EstimatorSubtitle = styled.p`
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  opacity: 0.9;
`;

const EstimatorContent = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

const TotalCostCard = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #bbf7d0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const TotalCostAmount = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: 0.5rem;
`;

const TotalCostLabel = styled.div`
  font-size: 0.875rem;
  color: #047857;
  margin-bottom: 1rem;
`;

const CostBreakdown = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #065f46;
`;

const CostItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
`;

const BreakdownSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CostCategory = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const CategoryName = styled.div`
  font-weight: 600;
  color: #374151;
`;

const CategoryAmount = styled.div`
  font-weight: 600;
  color: #059669;
`;

const CategoryItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: white;
  border-radius: 0.25rem;
  border: 1px solid #f3f4f6;
`;

const ItemName = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ItemAmount = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const ItemQuantity = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const SettingsSection = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const SettingGroup = styled.div`
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const SettingSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  background: white;
`;

const SettingInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;

  &:hover {
    background: #2563eb;
  }

  &.secondary {
    background: #6b7280;

    &:hover {
      background: #4b5563;
    }
  }
`;

const ExportSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
`;

const CostEstimator = ({ floorplanData }) => {
  const [costEstimate, setCostEstimate] = useState(null);
  const [settings, setSettings] = useState({
    region: 'us',
    quality: 'standard',
    currency: 'USD',
    includeFurniture: true,
    includeAppliances: true,
    includeLighting: true
  });
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (floorplanData) {
      calculateCostEstimate();
    }
  }, [floorplanData, settings]);

  const calculateCostEstimate = async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Extract room data from floorplan
    const rooms = floorplanData?.objects?.filter(obj => obj.roomType) || [];
    
    // Calculate areas and costs
    let totalArea = 0;
    let roomCosts = {};
    
    rooms.forEach(room => {
      const area = (room.width || 4) * (room.height || 3);
      totalArea += area;
      
      // Base cost per square meter/foot
      const baseCostPerSqUnit = settings.region === 'us' ? 150 : 120; // USD per sq meter
      const qualityMultiplier = {
        'budget': 0.7,
        'standard': 1.0,
        'premium': 1.5,
        'luxury': 2.0
      }[settings.quality] || 1.0;
      
      const roomCost = area * baseCostPerSqUnit * qualityMultiplier;
      roomCosts[room.roomType] = (roomCosts[room.roomType] || 0) + roomCost;
    });
    
    // Calculate detailed breakdown
    const materialsCost = totalArea * 80 * (settings.quality === 'luxury' ? 1.8 : settings.quality === 'premium' ? 1.4 : 1.0);
    const laborCost = totalArea * 60 * (settings.region === 'us' ? 1.2 : 1.0);
    const furnitureCost = settings.includeFurniture ? totalArea * 40 : 0;
    const appliancesCost = settings.includeAppliances ? totalArea * 30 : 0;
    const lightingCost = settings.includeLighting ? totalArea * 15 : 0;
    const fixturesCost = totalArea * 25;
    const permitsCost = totalArea * 5;
    const contingencyCost = (materialsCost + laborCost) * 0.1;
    
    const totalCost = materialsCost + laborCost + furnitureCost + appliancesCost + 
                     lightingCost + fixturesCost + permitsCost + contingencyCost;
    
    const estimate = {
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
      currency: settings.currency,
      quality: settings.quality,
      region: settings.region,
      lastUpdated: new Date()
    };
    
    setCostEstimate(estimate);
    setIsCalculating(false);
  };

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(amount);
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExportEstimate = () => {
    if (!costEstimate) return;
    
    const exportData = {
      ...costEstimate,
      floorplan: floorplanData,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cost-estimate.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateBOQ = () => {
    // Generate Bill of Quantities
    const boqData = {
      project: 'Floorplan Cost Estimate',
      date: new Date().toISOString(),
      items: [
        { description: 'Flooring (per sq unit)', quantity: costEstimate.totalArea, unit: 'sq units', rate: 25, amount: costEstimate.totalArea * 25 },
        { description: 'Wall Finishing', quantity: costEstimate.totalArea * 2.5, unit: 'sq units', rate: 15, amount: costEstimate.totalArea * 2.5 * 15 },
        { description: 'Ceiling Work', quantity: costEstimate.totalArea, unit: 'sq units', rate: 20, amount: costEstimate.totalArea * 20 },
        { description: 'Electrical Work', quantity: costEstimate.totalArea, unit: 'sq units', rate: 30, amount: costEstimate.totalArea * 30 },
        { description: 'Plumbing Work', quantity: costEstimate.totalArea, unit: 'sq units', rate: 25, amount: costEstimate.totalArea * 25 },
        { description: 'Labor Charges', quantity: costEstimate.totalArea, unit: 'sq units', rate: 60, amount: costEstimate.breakdown.labor },
        { description: 'Contingency (10%)', quantity: 1, unit: 'lump sum', rate: costEstimate.breakdown.contingency, amount: costEstimate.breakdown.contingency }
      ],
      total: costEstimate.total
    };
    
    const blob = new Blob([JSON.stringify(boqData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bill-of-quantities.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isCalculating) {
    return (
      <EstimatorContainer>
        <EstimatorHeader>
          <EstimatorTitle>💰 Cost Estimator</EstimatorTitle>
          <EstimatorSubtitle>Calculating costs...</EstimatorSubtitle>
        </EstimatorHeader>
        <EstimatorContent>
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <div>Calculating your cost estimate...</div>
          </div>
        </EstimatorContent>
      </EstimatorContainer>
    );
  }

  return (
    <EstimatorContainer>
      <EstimatorHeader>
        <EstimatorTitle>💰 Cost Estimator</EstimatorTitle>
        <EstimatorSubtitle>Real-time cost analysis for your project</EstimatorSubtitle>
      </EstimatorHeader>

      <EstimatorContent>
        {costEstimate && (
          <>
            <TotalCostCard>
              <TotalCostAmount>{formatCurrency(costEstimate.total)}</TotalCostAmount>
              <TotalCostLabel>Total Estimated Cost</TotalCostLabel>
              <CostBreakdown>
                <CostItem>
                  <span>Area:</span>
                  <span>{costEstimate.totalArea.toFixed(1)} sq units</span>
                </CostItem>
                <CostItem>
                  <span>Quality:</span>
                  <span>{costEstimate.quality}</span>
                </CostItem>
                <CostItem>
                  <span>Region:</span>
                  <span>{costEstimate.region.toUpperCase()}</span>
                </CostItem>
                <CostItem>
                  <span>Updated:</span>
                  <span>{costEstimate.lastUpdated.toLocaleDateString()}</span>
                </CostItem>
              </CostBreakdown>
            </TotalCostCard>

            <BreakdownSection>
              <SectionTitle>📊 Cost Breakdown</SectionTitle>
              
              <CostCategory>
                <CategoryHeader>
                  <CategoryName>🏗️ Construction</CategoryName>
                  <CategoryAmount>{formatCurrency(costEstimate.breakdown.materials + costEstimate.breakdown.labor)}</CategoryAmount>
                </CategoryHeader>
                <CategoryItems>
                  <CategoryItem>
                    <ItemName>Materials</ItemName>
                    <ItemAmount>{formatCurrency(costEstimate.breakdown.materials)}</ItemAmount>
                  </CategoryItem>
                  <CategoryItem>
                    <ItemName>Labor</ItemName>
                    <ItemAmount>{formatCurrency(costEstimate.breakdown.labor)}</ItemAmount>
                  </CategoryItem>
                </CategoryItems>
              </CostCategory>

              <CostCategory>
                <CategoryHeader>
                  <CategoryName>🛋️ Furnishing</CategoryName>
                  <CategoryAmount>{formatCurrency(costEstimate.breakdown.furniture + costEstimate.breakdown.appliances + costEstimate.breakdown.lighting)}</CategoryAmount>
                </CategoryHeader>
                <CategoryItems>
                  <CategoryItem>
                    <ItemName>Furniture</ItemName>
                    <ItemAmount>{formatCurrency(costEstimate.breakdown.furniture)}</ItemAmount>
                  </CategoryItem>
                  <CategoryItem>
                    <ItemName>Appliances</ItemName>
                    <ItemAmount>{formatCurrency(costEstimate.breakdown.appliances)}</ItemAmount>
                  </CategoryItem>
                  <CategoryItem>
                    <ItemName>Lighting</ItemName>
                    <ItemAmount>{formatCurrency(costEstimate.breakdown.lighting)}</ItemAmount>
                  </CategoryItem>
                </CategoryItems>
              </CostCategory>

              <CostCategory>
                <CategoryHeader>
                  <CategoryName>🔧 Additional</CategoryName>
                  <CategoryAmount>{formatCurrency(costEstimate.breakdown.fixtures + costEstimate.breakdown.permits + costEstimate.breakdown.contingency)}</CategoryAmount>
                </CategoryHeader>
                <CategoryItems>
                  <CategoryItem>
                    <ItemName>Fixtures & Hardware</ItemName>
                    <ItemAmount>{formatCurrency(costEstimate.breakdown.fixtures)}</ItemAmount>
                  </CategoryItem>
                  <CategoryItem>
                    <ItemName>Permits & Fees</ItemName>
                    <ItemAmount>{formatCurrency(costEstimate.breakdown.permits)}</ItemAmount>
                  </CategoryItem>
                  <CategoryItem>
                    <ItemName>Contingency (10%)</ItemName>
                    <ItemAmount>{formatCurrency(costEstimate.breakdown.contingency)}</ItemAmount>
                  </CategoryItem>
                </CategoryItems>
              </CostCategory>
            </BreakdownSection>
          </>
        )}

        <SettingsSection>
          <SectionTitle>⚙️ Settings</SectionTitle>
          
          <SettingGroup>
            <SettingLabel>Region</SettingLabel>
            <SettingSelect
              value={settings.region}
              onChange={(e) => handleSettingChange('region', e.target.value)}
            >
              <option value="us">United States</option>
              <option value="eu">Europe</option>
              <option value="asia">Asia</option>
              <option value="other">Other</option>
            </SettingSelect>
          </SettingGroup>

          <SettingGroup>
            <SettingLabel>Quality Level</SettingLabel>
            <SettingSelect
              value={settings.quality}
              onChange={(e) => handleSettingChange('quality', e.target.value)}
            >
              <option value="budget">Budget</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxury</option>
            </SettingSelect>
          </SettingGroup>

          <SettingGroup>
            <SettingLabel>Currency</SettingLabel>
            <SettingSelect
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </SettingSelect>
          </SettingGroup>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={settings.includeFurniture}
                onChange={(e) => handleSettingChange('includeFurniture', e.target.checked)}
              />
              Include Furniture
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={settings.includeAppliances}
                onChange={(e) => handleSettingChange('includeAppliances', e.target.checked)}
              />
              Include Appliances
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={settings.includeLighting}
                onChange={(e) => handleSettingChange('includeLighting', e.target.checked)}
              />
              Include Lighting
            </label>
          </div>
        </SettingsSection>

        <ExportSection>
          <ActionButton onClick={handleExportEstimate}>
            📄 Export Estimate
          </ActionButton>
          <ActionButton onClick={handleGenerateBOQ} className="secondary">
            📋 Generate BOQ
          </ActionButton>
        </ExportSection>
      </EstimatorContent>
    </EstimatorContainer>
  );
};

export default CostEstimator;
