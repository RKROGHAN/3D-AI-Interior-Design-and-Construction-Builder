import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Components
import { getFloorplans } from '../api/floorplans';

const DashboardContainer = styled.div`
  min-height: calc(100vh - 70px);
  background: #f8fafc;
  padding: 2rem 0;
`;

const DashboardHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  margin-bottom: 2rem;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const QuickActionButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const ContentSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
`;

const ViewToggle = styled.div`
  display: flex;
  background: #f3f4f6;
  border-radius: 0.5rem;
  padding: 0.25rem;
  gap: 0.25rem;
`;

const ToggleButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    background: #3b82f6;
    color: white;
  }
`;

const FloorplansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FloorplanCard = styled(motion.div)`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const FloorplanImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #9ca3af;
  position: relative;
`;

const FloorplanOverlay = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.5rem;
`;

const OverlayButton = styled.button`
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const FloorplanContent = styled.div`
  padding: 1.5rem;
`;

const FloorplanTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const FloorplanDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const FloorplanMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #9ca3af;
`;

const FloorplanActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled(Link)`
  flex: 1;
  padding: 0.5rem;
  text-align: center;
  text-decoration: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &.primary {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;

    &:hover {
      background: #2563eb;
    }
  }

  &.secondary {
    color: #6b7280;

    &:hover {
      border-color: #3b82f6;
      color: #3b82f6;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const CreateButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: #6b7280;
`;

const Dashboard = () => {
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  const { data: floorplansData, isLoading, error } = useQuery(
    'floorplans',
    () => getFloorplans({ page: 1, limit: 12 }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const floorplans = floorplansData?.floorplans || [];

  const handleCreateNew = () => {
    navigate('/editor');
  };

  const handleDuplicate = (id) => {
    // Implement duplicate functionality
    console.log('Duplicate floorplan:', id);
  };

  const handleShare = (id) => {
    // Implement share functionality
    console.log('Share floorplan:', id);
  };

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log('Delete floorplan:', id);
  };

  if (isLoading) {
    return (
      <DashboardContainer>
        <LoadingState>
          <div>Loading your floorplans...</div>
        </LoadingState>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Error loading floorplans</h2>
          <p>{error.message}</p>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <WelcomeSection>
          <WelcomeTitle>Welcome back! 👋</WelcomeTitle>
          <WelcomeSubtitle>
            Ready to design your next amazing space? Create, edit, and share your floorplans with ease.
          </WelcomeSubtitle>
          <QuickActions>
            <QuickActionButton to="/editor">
              ➕ Create New Plan
            </QuickActionButton>
            <QuickActionButton to="/gallery">
              🎨 Browse Templates
            </QuickActionButton>
            <QuickActionButton to="/pricing">
              💎 Upgrade Plan
            </QuickActionButton>
          </QuickActions>
        </WelcomeSection>

        <StatsSection>
          <StatCard>
            <StatNumber>{floorplans.length}</StatNumber>
            <StatLabel>Total Floorplans</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>0</StatNumber>
            <StatLabel>Shared Projects</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>0</StatNumber>
            <StatLabel>Collaborators</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>0</StatNumber>
            <StatLabel>Downloads</StatLabel>
          </StatCard>
        </StatsSection>
      </DashboardHeader>

      <ContentSection>
        <SectionHeader>
          <SectionTitle>My Floorplans</SectionTitle>
          <ViewToggle>
            <ToggleButton
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </ToggleButton>
            <ToggleButton
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              List
            </ToggleButton>
          </ViewToggle>
        </SectionHeader>

        {floorplans.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🏠</EmptyIcon>
            <EmptyTitle>No floorplans yet</EmptyTitle>
            <EmptyDescription>
              Start your design journey by creating your first floorplan. 
              Our intuitive editor makes it easy to bring your ideas to life.
            </EmptyDescription>
            <CreateButton to="/editor">
              ➕ Create Your First Floorplan
            </CreateButton>
          </EmptyState>
        ) : (
          <FloorplansGrid>
            {floorplans.map((floorplan, index) => (
              <FloorplanCard
                key={floorplan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/editor/${floorplan._id}`)}
              >
                <FloorplanImage>
                  🏠
                  <FloorplanOverlay>
                    <OverlayButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(floorplan._id);
                      }}
                      title="Duplicate"
                    >
                      📋
                    </OverlayButton>
                    <OverlayButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(floorplan._id);
                      }}
                      title="Share"
                    >
                      📤
                    </OverlayButton>
                    <OverlayButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(floorplan._id);
                      }}
                      title="Delete"
                    >
                      🗑️
                    </OverlayButton>
                  </FloorplanOverlay>
                </FloorplanImage>
                
                <FloorplanContent>
                  <FloorplanTitle>{floorplan.title}</FloorplanTitle>
                  <FloorplanDescription>
                    {floorplan.description || 'No description provided'}
                  </FloorplanDescription>
                  
                  <FloorplanMeta>
                    <span>Updated {new Date(floorplan.updatedAt).toLocaleDateString()}</span>
                    <span>{floorplan.metadata?.roomCount || 0} rooms</span>
                  </FloorplanMeta>
                  
                  <FloorplanActions>
                    <ActionButton
                      to={`/editor/${floorplan._id}`}
                      className="primary"
                    >
                      Edit
                    </ActionButton>
                    <ActionButton
                      to={`/editor/${floorplan._id}`}
                      className="secondary"
                    >
                      View
                    </ActionButton>
                  </FloorplanActions>
                </FloorplanContent>
              </FloorplanCard>
            ))}
          </FloorplansGrid>
        )}
      </ContentSection>
    </DashboardContainer>
  );
};

export default Dashboard;
