import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import styled from 'styled-components';

// Components
import FloorplanEditor from '../components/Editor/FloorplanEditor';
import ThreeDViewer from '../components/Editor/ThreeDViewer';
import PanoramaViewer from '../components/Editor/PanoramaViewer';
import AIAssistant from '../components/AI/AIAssistant';
import CostEstimator from '../components/Editor/CostEstimator';
import CollaborationPanel from '../components/Editor/CollaborationPanel';

// API
import { getFloorplan, updateFloorplan, createFloorplan } from '../api/floorplans';

const EditorContainer = styled.div`
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  background: #f8fafc;
`;

const EditorHeader = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const EditorTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TitleInput = styled.input`
  font-size: 1.25rem;
  font-weight: 600;
  border: none;
  background: transparent;
  color: #1a202c;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  min-width: 200px;

  &:focus {
    outline: none;
    background: #f3f4f6;
  }
`;

const ViewTabs = styled.div`
  display: flex;
  background: #f3f4f6;
  border-radius: 0.5rem;
  padding: 0.25rem;
  gap: 0.25rem;
`;

const ViewTab = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: 0.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
  }

  &.active {
    background: #3b82f6;
    color: white;
  }
`;

const EditorActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.25rem;
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

  &.primary {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;

    &:hover {
      background: #2563eb;
    }
  }
`;

const EditorContent = styled.div`
  flex: 1;
  display: flex;
  position: relative;
`;

const SidePanel = styled.div`
  width: 300px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;

  @media (max-width: 1024px) {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 10;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;

const SidePanelToggle = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 20;
  padding: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  cursor: pointer;
  display: none;

  @media (max-width: 1024px) {
    display: block;
  }
`;

const MainEditor = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const EditorView = styled.div`
  flex: 1;
  position: relative;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [currentView, setCurrentView] = useState('2d');
  const [floorplanData, setFloorplanData] = useState(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [activePanel, setActivePanel] = useState('ai');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch floorplan data
  const { data: floorplan, isLoading, error } = useQuery(
    ['floorplan', id],
    () => id ? getFloorplan(id) : null,
    {
      enabled: !!id,
      onSuccess: (data) => {
        if (data?.floorplan?.views?.['2d']) {
          setFloorplanData(data.floorplan.views['2d'].data);
        }
      }
    }
  );

  // Create new floorplan mutation
  const createMutation = useMutation(createFloorplan, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['floorplans']);
      navigate(`/editor/${data.floorplan._id}`);
      toast.success('Floorplan created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create floorplan');
    }
  });

  // Update floorplan mutation
  const updateMutation = useMutation(
    ({ id, data }) => updateFloorplan(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['floorplan', id]);
        toast.success('Floorplan saved successfully!');
      },
      onError: (error) => {
        toast.error('Failed to save floorplan');
      }
    }
  );

  // Auto-save functionality
  useEffect(() => {
    if (floorplanData && id) {
      const timeoutId = setTimeout(() => {
        handleSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [floorplanData, id]);

  const handleSave = async () => {
    if (!floorplanData) return;
    
    setIsSaving(true);
    try {
      const updateData = {
        views: {
          '2d': {
            data: floorplanData,
            lastUpdated: new Date()
          }
        }
      };

      if (id) {
        await updateMutation.mutateAsync({ id, data: updateData });
      } else {
        // Create new floorplan
        const newFloorplan = {
          title: 'Untitled Floorplan',
          description: '',
          dimensions: { width: 10, height: 8, units: 'meters' },
          rooms: [],
          views: {
            '2d': {
              data: floorplanData,
              lastUpdated: new Date()
            }
          }
        };
        await createMutation.mutateAsync(newFloorplan);
      }
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDataUpdate = (newData) => {
    setFloorplanData(newData);
  };

  const handleTitleChange = (newTitle) => {
    if (id && floorplan) {
      updateMutation.mutate({
        id,
        data: { title: newTitle }
      });
    }
  };

  const handleDownload = () => {
    if (!floorplanData) return;
    
    // Generate download data
    const downloadData = {
      floorplan: floorplan?.floorplan || {},
      data: floorplanData,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(downloadData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${floorplan?.floorplan?.title || 'floorplan'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Floorplan downloaded successfully!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: floorplan?.floorplan?.title || 'My Floorplan',
        text: 'Check out my floorplan design!',
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case '2d':
        return (
          <FloorplanEditor
            floorplan={floorplan?.floorplan}
            onSave={handleSave}
            onUpdate={handleDataUpdate}
          />
        );
      case '3d':
        return (
          <ThreeDViewer
            floorplanData={floorplanData}
            onRoomClick={(room) => {
              console.log('Room clicked:', room);
            }}
          />
        );
      case '360':
        return (
          <PanoramaViewer
            floorplanData={floorplanData}
            currentRoom={null}
            onRoomChange={(room) => {
              console.log('Room changed:', room);
            }}
            onClose={() => setCurrentView('2d')}
          />
        );
      default:
        return null;
    }
  };

  const renderSidePanel = () => {
    switch (activePanel) {
      case 'ai':
        return <AIAssistant floorplanData={floorplanData} onSuggestionApply={handleDataUpdate} />;
      case 'cost':
        return <CostEstimator floorplanData={floorplanData} />;
      case 'collaborate':
        return <CollaborationPanel floorplanId={id} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <EditorContainer>
        <LoadingOverlay>
          <div>Loading editor...</div>
        </LoadingOverlay>
      </EditorContainer>
    );
  }

  if (error) {
    return (
      <EditorContainer>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Error loading floorplan</h2>
          <p>{error.message}</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </EditorContainer>
    );
  }

  return (
    <EditorContainer>
      <EditorHeader>
        <EditorTitle>
          <SidePanelToggle onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}>
            ☰
          </SidePanelToggle>
          <TitleInput
            value={floorplan?.floorplan?.title || 'Untitled Floorplan'}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter floorplan title"
          />
          {isSaving && <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Saving...</span>}
        </EditorTitle>

        <ViewTabs>
          <ViewTab
            className={currentView === '2d' ? 'active' : ''}
            onClick={() => setCurrentView('2d')}
          >
            📐 2D Plan
          </ViewTab>
          <ViewTab
            className={currentView === '3d' ? 'active' : ''}
            onClick={() => setCurrentView('3d')}
          >
            🏠 3D View
          </ViewTab>
          <ViewTab
            className={currentView === '360' ? 'active' : ''}
            onClick={() => setCurrentView('360')}
          >
            🌐 360° Tour
          </ViewTab>
        </ViewTabs>

        <EditorActions>
          <ActionButton onClick={handleShare}>
            📤 Share
          </ActionButton>
          <ActionButton onClick={handleDownload}>
            💾 Download
          </ActionButton>
          <ActionButton onClick={handleSave} className="primary" disabled={isSaving}>
            {isSaving ? '⏳' : '💾'} Save
          </ActionButton>
        </EditorActions>
      </EditorHeader>

      <EditorContent>
        <SidePanel isOpen={isSidePanelOpen}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                className={`btn btn-sm ${activePanel === 'ai' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActivePanel('ai')}
              >
                🤖 AI
              </button>
              <button
                className={`btn btn-sm ${activePanel === 'cost' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActivePanel('cost')}
              >
                💰 Cost
              </button>
              <button
                className={`btn btn-sm ${activePanel === 'collaborate' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActivePanel('collaborate')}
              >
                👥 Team
              </button>
            </div>
          </div>
          {renderSidePanel()}
        </SidePanel>

        <MainEditor>
          <EditorView>
            {renderCurrentView()}
          </EditorView>
        </MainEditor>
      </EditorContent>
    </EditorContainer>
  );
};

export default Editor;
