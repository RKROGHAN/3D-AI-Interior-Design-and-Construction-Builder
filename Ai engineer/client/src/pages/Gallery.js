import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// API
import { getPublicFloorplans } from '../api/floorplans';

const GalleryContainer = styled.div`
  min-height: calc(100vh - 70px);
  background: #f8fafc;
  padding: 2rem 0;
`;

const GalleryHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
  margin-bottom: 3rem;
`;

const GalleryTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const GallerySubtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const FilterSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  margin-bottom: 2rem;
`;

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }

  &.active {
    border-color: #3b82f6;
    background: #3b82f6;
    color: white;
  }
`;

const SearchSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  min-width: 300px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 480px) {
    min-width: 100%;
  }
`;

const SortSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const GalleryGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const GalleryCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }
`;

const CardImage = styled.div`
  height: 250px;
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #9ca3af;
  position: relative;
  overflow: hidden;
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${GalleryCard}:hover & {
    opacity: 1;
  }
`;

const OverlayButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #2563eb;
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const CardDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 1rem;
`;

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }

  &.primary {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;

    &:hover {
      background: #2563eb;
    }
  }
`;

const LoadMoreSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const LoadMoreButton = styled.button`
  padding: 1rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  max-width: 600px;
  margin: 0 auto;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: #6b7280;
`;

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery(
    ['public-floorplans', activeFilter, searchQuery, sortBy, page],
    () => getPublicFloorplans({
      type: activeFilter,
      search: searchQuery,
      sort: sortBy,
      page,
      limit: 12
    }),
    {
      keepPreviousData: true,
    }
  );

  const floorplans = data?.floorplans || [];
  const hasMore = data?.totalPages > page;

  const filters = [
    { id: 'all', label: 'All Designs', icon: '🏠' },
    { id: 'templates', label: 'Templates', icon: '📋' },
    { id: 'public', label: 'Community', icon: '👥' },
    { id: 'residential', label: 'Residential', icon: '🏡' },
    { id: 'commercial', label: 'Commercial', icon: '🏢' },
    { id: 'modern', label: 'Modern', icon: '✨' },
    { id: 'traditional', label: 'Traditional', icon: '🏛️' }
  ];

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleUseTemplate = (floorplan) => {
    // Implement template usage
    console.log('Use template:', floorplan);
  };

  const handleViewDetails = (floorplan) => {
    // Implement view details
    console.log('View details:', floorplan);
  };

  if (isLoading && page === 1) {
    return (
      <GalleryContainer>
        <LoadingState>
          <div>Loading gallery...</div>
        </LoadingState>
      </GalleryContainer>
    );
  }

  if (error) {
    return (
      <GalleryContainer>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Error loading gallery</h2>
          <p>{error.message}</p>
        </div>
      </GalleryContainer>
    );
  }

  return (
    <GalleryContainer>
      <GalleryHeader>
        <GalleryTitle>Design Gallery</GalleryTitle>
        <GallerySubtitle>
          Discover amazing floorplan designs from our community. 
          Get inspired and find the perfect template for your project.
        </GallerySubtitle>
      </GalleryHeader>

      <FilterSection>
        <FilterTabs>
          {filters.map((filter) => (
            <FilterTab
              key={filter.id}
              className={activeFilter === filter.id ? 'active' : ''}
              onClick={() => handleFilterChange(filter.id)}
            >
              <span>{filter.icon}</span>
              {filter.label}
            </FilterTab>
          ))}
        </FilterTabs>

        <SearchSection>
          <SearchInput
            type="text"
            placeholder="Search designs, styles, or keywords..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <SortSelect value={sortBy} onChange={handleSortChange}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
          </SortSelect>
        </SearchSection>
      </FilterSection>

      {floorplans.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🔍</EmptyIcon>
          <EmptyTitle>No designs found</EmptyTitle>
          <EmptyDescription>
            Try adjusting your search criteria or browse different categories.
          </EmptyDescription>
        </EmptyState>
      ) : (
        <>
          <GalleryGrid>
            {floorplans.map((floorplan, index) => (
              <GalleryCard
                key={floorplan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CardImage>
                  🏠
                  <CardOverlay>
                    <OverlayButton onClick={() => handleUseTemplate(floorplan)}>
                      ➕ Use Template
                    </OverlayButton>
                  </CardOverlay>
                </CardImage>

                <CardContent>
                  <CardTitle>{floorplan.title}</CardTitle>
                  <CardDescription>
                    {floorplan.description || 'A beautiful floorplan design'}
                  </CardDescription>

                  <CardMeta>
                    <span>By {floorplan.user?.name || 'Anonymous'}</span>
                    <span>{floorplan.metadata?.roomCount || 0} rooms</span>
                  </CardMeta>

                  <CardTags>
                    {floorplan.tags?.slice(0, 3).map((tag, tagIndex) => (
                      <Tag key={tagIndex}>{tag}</Tag>
                    ))}
                    {floorplan.design?.style && (
                      <Tag>{floorplan.design.style}</Tag>
                    )}
                  </CardTags>

                  <CardActions>
                    <ActionButton onClick={() => handleViewDetails(floorplan)}>
                      👁️ Preview
                    </ActionButton>
                    <ActionButton
                      className="primary"
                      onClick={() => handleUseTemplate(floorplan)}
                    >
                      ➕ Use
                    </ActionButton>
                  </CardActions>
                </CardContent>
              </GalleryCard>
            ))}
          </GalleryGrid>

          {hasMore && (
            <LoadMoreSection>
              <LoadMoreButton onClick={handleLoadMore} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Load More Designs'}
              </LoadMoreButton>
            </LoadMoreSection>
          )}
        </>
      )}
    </GalleryContainer>
  );
};

export default Gallery;
