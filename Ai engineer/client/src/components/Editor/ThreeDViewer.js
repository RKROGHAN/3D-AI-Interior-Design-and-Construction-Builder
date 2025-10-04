import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Text, Box, Plane } from '@react-three/drei';
import * as THREE from 'three';
import styled from 'styled-components';

const ViewerContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  position: relative;
`;

const Controls = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ControlButton = styled.button`
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
`;

const ViewModeSelector = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  display: flex;
  gap: 0.25rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.25rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

const ViewModeButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
  }

  &.active {
    background: #3b82f6;
    color: white;
  }
`;

const InfoPanel = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #374151;
`;

// 3D Room Component
const Room3D = ({ room, position, dimensions, roomType, color = '#e5e7eb' }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = hovered ? 0.8 : 0.6;
    }
  });

  const roomIcons = {
    living: '🛋️',
    bedroom: '🛏️',
    kitchen: '🍳',
    bathroom: '🚿',
    dining: '🍽️',
    office: '💻',
    storage: '📦',
    balcony: '🌿'
  };

  return (
    <group position={[position.x, 0, position.z]}>
      {/* Floor */}
      <Plane
        ref={meshRef}
        args={[dimensions.width, dimensions.height]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshLambertMaterial color={color} transparent opacity={0.6} />
      </Plane>

      {/* Walls */}
      <Box args={[dimensions.width, 2.5, 0.2]} position={[0, 1.25, -dimensions.height / 2]}>
        <meshLambertMaterial color="#d1d5db" />
      </Box>
      <Box args={[dimensions.width, 2.5, 0.2]} position={[0, 1.25, dimensions.height / 2]}>
        <meshLambertMaterial color="#d1d5db" />
      </Box>
      <Box args={[0.2, 2.5, dimensions.height]} position={[-dimensions.width / 2, 1.25, 0]}>
        <meshLambertMaterial color="#d1d5db" />
      </Box>
      <Box args={[0.2, 2.5, dimensions.height]} position={[dimensions.width / 2, 1.25, 0]}>
        <meshLambertMaterial color="#d1d5db" />
      </Box>

      {/* Room Label */}
      <Text
        position={[0, 0.1, 0]}
        fontSize={0.5}
        color="#374151"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.woff"
      >
        {roomIcons[roomType] || '🏠'} {roomType.charAt(0).toUpperCase() + roomType.slice(1)}
      </Text>
    </group>
  );
};

// Furniture Component
const Furniture = ({ type, position, rotation = 0, scale = 1 }) => {
  const furnitureModels = {
    sofa: { shape: 'box', dimensions: [2, 0.5, 0.8], color: '#8b5cf6' },
    table: { shape: 'box', dimensions: [1.2, 0.05, 0.8], color: '#92400e' },
    chair: { shape: 'box', dimensions: [0.5, 0.8, 0.5], color: '#059669' },
    bed: { shape: 'box', dimensions: [2, 0.3, 1.5], color: '#dc2626' },
    desk: { shape: 'box', dimensions: [1.5, 0.05, 0.8], color: '#7c2d12' },
    wardrobe: { shape: 'box', dimensions: [0.6, 2, 0.4], color: '#374151' }
  };

  const model = furnitureModels[type] || furnitureModels.sofa;

  return (
    <Box
      args={model.dimensions}
      position={[position.x, model.dimensions[1] / 2, position.z]}
      rotation={[0, rotation, 0]}
      scale={scale}
    >
      <meshLambertMaterial color={model.color} />
    </Box>
  );
};

// Scene Component
const Scene = ({ floorplanData, viewMode, onRoomClick }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (viewMode === 'top') {
      camera.position.set(0, 20, 0);
      camera.lookAt(0, 0, 0);
    } else if (viewMode === 'isometric') {
      camera.position.set(10, 10, 10);
      camera.lookAt(0, 0, 0);
    } else if (viewMode === 'walkthrough') {
      camera.position.set(0, 1.6, 5);
      camera.lookAt(0, 1.6, 0);
    }
  }, [viewMode, camera]);

  // Convert 2D floorplan data to 3D
  const rooms = floorplanData?.objects?.filter(obj => obj.roomType) || [];
  const furniture = floorplanData?.objects?.filter(obj => obj.furnitureType) || [];

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.4} />

      {/* Ground plane */}
      <Plane args={[50, 50]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <meshLambertMaterial color="#f3f4f6" />
      </Plane>

      {/* Render rooms */}
      {rooms.map((room, index) => (
        <Room3D
          key={room.roomId || index}
          room={room}
          position={{ x: room.left || 0, z: room.top || 0 }}
          dimensions={{ width: room.width || 4, height: room.height || 3 }}
          roomType={room.roomType}
          color={room.fill || '#e5e7eb'}
        />
      ))}

      {/* Render furniture */}
      {furniture.map((item, index) => (
        <Furniture
          key={item.furnitureId || index}
          type={item.furnitureType}
          position={{ x: item.left || 0, z: item.top || 0 }}
          rotation={item.angle || 0}
          scale={item.scaleX || 1}
        />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minPolarAngle={viewMode === 'top' ? Math.PI / 2 - 0.1 : 0}
        maxPolarAngle={viewMode === 'top' ? Math.PI / 2 + 0.1 : Math.PI}
        minDistance={5}
        maxDistance={50}
      />
    </>
  );
};

const ThreeDViewer = ({ floorplanData, onRoomClick }) => {
  const [viewMode, setViewMode] = useState('isometric');
  const [showGrid, setShowGrid] = useState(true);
  const [showFurniture, setShowFurniture] = useState(true);
  const [lighting, setLighting] = useState('day');

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const calculateStats = () => {
    if (!floorplanData?.objects) return { totalArea: 0, roomCount: 0 };
    
    const rooms = floorplanData.objects.filter(obj => obj.roomType);
    const totalArea = rooms.reduce((sum, room) => {
      return sum + ((room.width || 0) * (room.height || 0));
    }, 0);
    
    return {
      totalArea: Math.round(totalArea),
      roomCount: rooms.length
    };
  };

  const stats = calculateStats();

  return (
    <ViewerContainer>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} />
        <Scene
          floorplanData={floorplanData}
          viewMode={viewMode}
          onRoomClick={onRoomClick}
        />
        <Environment preset="apartment" />
      </Canvas>

      <Controls>
        <ControlButton
          className={showGrid ? 'active' : ''}
          onClick={() => setShowGrid(!showGrid)}
        >
          {showGrid ? 'Hide' : 'Show'} Grid
        </ControlButton>
        <ControlButton
          className={showFurniture ? 'active' : ''}
          onClick={() => setShowFurniture(!showFurniture)}
        >
          {showFurniture ? 'Hide' : 'Show'} Furniture
        </ControlButton>
        <ControlButton
          onClick={() => setLighting(lighting === 'day' ? 'night' : 'day')}
        >
          {lighting === 'day' ? 'Night' : 'Day'} Mode
        </ControlButton>
      </Controls>

      <ViewModeSelector>
        <ViewModeButton
          className={viewMode === 'top' ? 'active' : ''}
          onClick={() => handleViewModeChange('top')}
          title="Top View"
        >
          📐
        </ViewModeButton>
        <ViewModeButton
          className={viewMode === 'isometric' ? 'active' : ''}
          onClick={() => handleViewModeChange('isometric')}
          title="Isometric View"
        >
          📦
        </ViewModeButton>
        <ViewModeButton
          className={viewMode === 'walkthrough' ? 'active' : ''}
          onClick={() => handleViewModeChange('walkthrough')}
          title="Walkthrough"
        >
          🚶
        </ViewModeButton>
      </ViewModeSelector>

      <InfoPanel>
        <div><strong>Total Area:</strong> {stats.totalArea} sq units</div>
        <div><strong>Rooms:</strong> {stats.roomCount}</div>
        <div><strong>View:</strong> {viewMode}</div>
        <div><strong>Lighting:</strong> {lighting}</div>
      </InfoPanel>
    </ViewerContainer>
  );
};

export default ThreeDViewer;
