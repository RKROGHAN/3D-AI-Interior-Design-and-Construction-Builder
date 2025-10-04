import React, { useRef, useEffect, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import styled from 'styled-components';

const EditorContainer = styled.div`
  display: flex;
  height: calc(100vh - 70px);
  background: #f8fafc;
`;

const Toolbar = styled.div`
  width: 250px;
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 1rem;
  overflow-y: auto;
`;

const ToolGroup = styled.div`
  margin-bottom: 2rem;
`;

const ToolGroupTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
`;

const ToolButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  color: #374151;
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
    background: #eff6ff;
    color: #3b82f6;
  }
`;

const CanvasContainer = styled.div`
  flex: 1;
  position: relative;
  background: #ffffff;
  background-image: 
    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
  background-size: 20px 20px;
`;

const Canvas = styled.canvas`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const PropertiesPanel = styled.div`
  width: 300px;
  background: white;
  border-left: 1px solid #e5e7eb;
  padding: 1rem;
  overflow-y: auto;
`;

const PropertyGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const PropertyLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
`;

const PropertyInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
`;

const PropertySelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
`;

const RoomTypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const RoomTypeButton = styled.button`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    border-color: #3b82f6;
  }

  &.active {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`;

const RoomIcon = styled.div`
  font-size: 1.5rem;
`;

const RoomLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
`;

const FloorplanEditor = ({ floorplan, onSave, onUpdate }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedObject, setSelectedObject] = useState(null);
  const [roomType, setRoomType] = useState('living');
  const [gridSize, setGridSize] = useState(20);
  const [snapToGrid, setSnapToGrid] = useState(true);

  const roomTypes = {
    living: { icon: '🛋️', label: 'Living' },
    bedroom: { icon: '🛏️', label: 'Bedroom' },
    kitchen: { icon: '🍳', label: 'Kitchen' },
    bathroom: { icon: '🚿', label: 'Bathroom' },
    dining: { icon: '🍽️', label: 'Dining' },
    office: { icon: '💻', label: 'Office' },
    storage: { icon: '📦', label: 'Storage' },
    balcony: { icon: '🌿', label: 'Balcony' }
  };

  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true
    });

    fabricCanvasRef.current = canvas;

    // Set up grid
    canvas.set({
      gridSize: gridSize,
      snapToGrid: snapToGrid
    });

    // Object selection events
    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected[0]);
    });

    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected[0]);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    // Object modification events
    canvas.on('object:modified', () => {
      if (onUpdate) {
        onUpdate(canvas.toJSON());
      }
    });

    // Load existing floorplan data
    if (floorplan && floorplan.views && floorplan.views['2d']) {
      canvas.loadFromJSON(floorplan.views['2d'].data, () => {
        canvas.renderAll();
      });
    }

    return canvas;
  }, [floorplan, onUpdate, gridSize, snapToGrid]);

  useEffect(() => {
    const canvas = initializeCanvas();
    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [initializeCanvas]);

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.isDrawingMode = false;
      fabricCanvasRef.current.selection = true;
      
      switch (tool) {
        case 'wall':
          fabricCanvasRef.current.isDrawingMode = true;
          fabricCanvasRef.current.freeDrawingBrush = new fabric.PencilBrush(fabricCanvasRef.current);
          fabricCanvasRef.current.freeDrawingBrush.width = 10;
          fabricCanvasRef.current.freeDrawingBrush.color = '#374151';
          break;
        case 'room':
          // Room creation will be handled by click events
          break;
        case 'door':
          // Door placement will be handled by click events
          break;
        case 'window':
          // Window placement will be handled by click events
          break;
        default:
          fabricCanvasRef.current.selection = true;
      }
    }
  };

  const createRoom = (x, y, width = 200, height = 150) => {
    if (!fabricCanvasRef.current) return;

    const room = new fabric.Rect({
      left: x,
      top: y,
      width: width,
      height: height,
      fill: 'rgba(59, 130, 246, 0.1)',
      stroke: '#3b82f6',
      strokeWidth: 2,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      lockUniScaling: false,
      cornerStyle: 'circle',
      cornerColor: '#3b82f6',
      cornerSize: 8,
      transparentCorners: false
    });

    // Add room type label
    const label = new fabric.Text(roomTypes[roomType].label, {
      left: x + width / 2,
      top: y + height / 2,
      fontSize: 16,
      fontWeight: 'bold',
      fill: '#374151',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });

    // Add room type icon
    const icon = new fabric.Text(roomTypes[roomType].icon, {
      left: x + width / 2,
      top: y + height / 2 - 20,
      fontSize: 24,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });

    // Create a group for the room
    const roomGroup = new fabric.Group([room, label, icon], {
      left: x,
      top: y,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      cornerStyle: 'circle',
      cornerColor: '#3b82f6',
      cornerSize: 8,
      transparentCorners: false
    });

    // Add room type metadata
    roomGroup.roomType = roomType;
    roomGroup.roomId = `room_${Date.now()}`;

    fabricCanvasRef.current.add(roomGroup);
    fabricCanvasRef.current.setActiveObject(roomGroup);
    fabricCanvasRef.current.renderAll();

    if (onUpdate) {
      onUpdate(fabricCanvasRef.current.toJSON());
    }
  };

  const createWall = (x1, y1, x2, y2) => {
    if (!fabricCanvasRef.current) return;

    const wall = new fabric.Line([x1, y1, x2, y2], {
      stroke: '#374151',
      strokeWidth: 10,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      cornerStyle: 'circle',
      cornerColor: '#374151',
      cornerSize: 8,
      transparentCorners: false
    });

    wall.wallId = `wall_${Date.now()}`;
    fabricCanvasRef.current.add(wall);
    fabricCanvasRef.current.renderAll();

    if (onUpdate) {
      onUpdate(fabricCanvasRef.current.toJSON());
    }
  };

  const createDoor = (x, y) => {
    if (!fabricCanvasRef.current) return;

    const door = new fabric.Rect({
      left: x,
      top: y,
      width: 20,
      height: 80,
      fill: '#8b5cf6',
      stroke: '#6d28d9',
      strokeWidth: 2,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      cornerStyle: 'circle',
      cornerColor: '#8b5cf6',
      cornerSize: 6,
      transparentCorners: false
    });

    door.doorId = `door_${Date.now()}`;
    fabricCanvasRef.current.add(door);
    fabricCanvasRef.current.renderAll();

    if (onUpdate) {
      onUpdate(fabricCanvasRef.current.toJSON());
    }
  };

  const createWindow = (x, y) => {
    if (!fabricCanvasRef.current) return;

    const window = new fabric.Rect({
      left: x,
      top: y,
      width: 60,
      height: 20,
      fill: '#06b6d4',
      stroke: '#0891b2',
      strokeWidth: 2,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      cornerStyle: 'circle',
      cornerColor: '#06b6d4',
      cornerSize: 6,
      transparentCorners: false
    });

    window.windowId = `window_${Date.now()}`;
    fabricCanvasRef.current.add(window);
    fabricCanvasRef.current.renderAll();

    if (onUpdate) {
      onUpdate(fabricCanvasRef.current.toJSON());
    }
  };

  const handleCanvasClick = (e) => {
    if (selectedTool === 'room') {
      const pointer = fabricCanvasRef.current.getPointer(e.e);
      createRoom(pointer.x - 100, pointer.y - 75);
    } else if (selectedTool === 'door') {
      const pointer = fabricCanvasRef.current.getPointer(e.e);
      createDoor(pointer.x - 10, pointer.y - 40);
    } else if (selectedTool === 'window') {
      const pointer = fabricCanvasRef.current.getPointer(e.e);
      createWindow(pointer.x - 30, pointer.y - 10);
    }
  };

  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.on('mouse:down', handleCanvasClick);
    }
  }, [selectedTool]);

  const handleSave = () => {
    if (fabricCanvasRef.current && onSave) {
      const data = fabricCanvasRef.current.toJSON();
      onSave(data);
    }
  };

  const handleClear = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.renderAll();
    }
  };

  const handleUndo = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.undo();
    }
  };

  const handleRedo = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.redo();
    }
  };

  const updateObjectProperty = (property, value) => {
    if (selectedObject && fabricCanvasRef.current) {
      selectedObject.set(property, value);
      fabricCanvasRef.current.renderAll();
      
      if (onUpdate) {
        onUpdate(fabricCanvasRef.current.toJSON());
      }
    }
  };

  return (
    <EditorContainer>
      <Toolbar>
        <ToolGroup>
          <ToolGroupTitle>Tools</ToolGroupTitle>
          <ToolButton
            className={selectedTool === 'select' ? 'active' : ''}
            onClick={() => handleToolSelect('select')}
          >
            <span>↖️</span> Select
          </ToolButton>
          <ToolButton
            className={selectedTool === 'wall' ? 'active' : ''}
            onClick={() => handleToolSelect('wall')}
          >
            <span>📏</span> Wall
          </ToolButton>
          <ToolButton
            className={selectedTool === 'room' ? 'active' : ''}
            onClick={() => handleToolSelect('room')}
          >
            <span>🏠</span> Room
          </ToolButton>
          <ToolButton
            className={selectedTool === 'door' ? 'active' : ''}
            onClick={() => handleToolSelect('door')}
          >
            <span>🚪</span> Door
          </ToolButton>
          <ToolButton
            className={selectedTool === 'window' ? 'active' : ''}
            onClick={() => handleToolSelect('window')}
          >
            <span>🪟</span> Window
          </ToolButton>
        </ToolGroup>

        <ToolGroup>
          <ToolGroupTitle>Room Types</ToolGroupTitle>
          <RoomTypeSelector>
            {Object.entries(roomTypes).map(([type, config]) => (
              <RoomTypeButton
                key={type}
                className={roomType === type ? 'active' : ''}
                onClick={() => setRoomType(type)}
              >
                <RoomIcon>{config.icon}</RoomIcon>
                <RoomLabel>{config.label}</RoomLabel>
              </RoomTypeButton>
            ))}
          </RoomTypeSelector>
        </ToolGroup>

        <ToolGroup>
          <ToolGroupTitle>Actions</ToolGroupTitle>
          <ToolButton onClick={handleSave}>
            <span>💾</span> Save
          </ToolButton>
          <ToolButton onClick={handleUndo}>
            <span>↶</span> Undo
          </ToolButton>
          <ToolButton onClick={handleRedo}>
            <span>↷</span> Redo
          </ToolButton>
          <ToolButton onClick={handleClear}>
            <span>🗑️</span> Clear
          </ToolButton>
        </ToolGroup>

        <ToolGroup>
          <ToolGroupTitle>Settings</ToolGroupTitle>
          <PropertyLabel>Grid Size</PropertyLabel>
          <PropertyInput
            type="number"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            min="10"
            max="50"
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              checked={snapToGrid}
              onChange={(e) => setSnapToGrid(e.target.checked)}
            />
            Snap to Grid
          </label>
        </ToolGroup>
      </Toolbar>

      <CanvasContainer>
        <Canvas ref={canvasRef} />
      </CanvasContainer>

      <PropertiesPanel>
        {selectedObject ? (
          <>
            <ToolGroupTitle>Properties</ToolGroupTitle>
            
            <PropertyGroup>
              <PropertyLabel>Position</PropertyLabel>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <PropertyInput
                  type="number"
                  value={Math.round(selectedObject.left || 0)}
                  onChange={(e) => updateObjectProperty('left', Number(e.target.value))}
                  placeholder="X"
                />
                <PropertyInput
                  type="number"
                  value={Math.round(selectedObject.top || 0)}
                  onChange={(e) => updateObjectProperty('top', Number(e.target.value))}
                  placeholder="Y"
                />
              </div>
            </PropertyGroup>

            {selectedObject.width !== undefined && (
              <PropertyGroup>
                <PropertyLabel>Size</PropertyLabel>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <PropertyInput
                    type="number"
                    value={Math.round(selectedObject.width || 0)}
                    onChange={(e) => updateObjectProperty('width', Number(e.target.value))}
                    placeholder="Width"
                  />
                  <PropertyInput
                    type="number"
                    value={Math.round(selectedObject.height || 0)}
                    onChange={(e) => updateObjectProperty('height', Number(e.target.value))}
                    placeholder="Height"
                  />
                </div>
              </PropertyGroup>
            )}

            <PropertyGroup>
              <PropertyLabel>Fill Color</PropertyLabel>
              <PropertyInput
                type="color"
                value={selectedObject.fill || '#ffffff'}
                onChange={(e) => updateObjectProperty('fill', e.target.value)}
              />
            </PropertyGroup>

            <PropertyGroup>
              <PropertyLabel>Stroke Color</PropertyLabel>
              <PropertyInput
                type="color"
                value={selectedObject.stroke || '#000000'}
                onChange={(e) => updateObjectProperty('stroke', e.target.value)}
              />
            </PropertyGroup>

            {selectedObject.strokeWidth !== undefined && (
              <PropertyGroup>
                <PropertyLabel>Stroke Width</PropertyLabel>
                <PropertyInput
                  type="number"
                  value={selectedObject.strokeWidth || 1}
                  onChange={(e) => updateObjectProperty('strokeWidth', Number(e.target.value))}
                  min="1"
                  max="20"
                />
              </PropertyGroup>
            )}

            <PropertyGroup>
              <PropertyLabel>Rotation</PropertyLabel>
              <PropertyInput
                type="number"
                value={Math.round(selectedObject.angle || 0)}
                onChange={(e) => updateObjectProperty('angle', Number(e.target.value))}
                min="0"
                max="360"
              />
            </PropertyGroup>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>
            Select an object to edit its properties
          </div>
        )}
      </PropertiesPanel>
    </EditorContainer>
  );
};

export default FloorplanEditor;
