import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const PanoramaContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  overflow: hidden;
`;

const PanoramaCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
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
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &.active {
    background: #3b82f6;
    border-color: #3b82f6;
  }
`;

const Hotspot = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  background: rgba(59, 130, 246, 0.8);
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  z-index: 5;

  &:hover {
    background: rgba(59, 130, 246, 1);
    transform: scale(1.1);
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(59, 130, 246, 0.3);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;

const RoomInfo = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 0.875rem;
  max-width: 300px;
`;

const Navigation = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
`;

const NavButton = styled.button`
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  z-index: 20;
`;

class PanoramaRenderer {
  constructor(canvas, image) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.image = image;
    this.rotationX = 0;
    this.rotationY = 0;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.fov = 60;
    this.hotspots = [];
    
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.addEventListener('wheel', this.onWheel.bind(this));
    
    // Touch events for mobile
    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
  }

  onMouseDown(e) {
    this.isDragging = true;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  }

  onMouseMove(e) {
    if (!this.isDragging) return;
    
    const deltaX = e.clientX - this.lastMouseX;
    const deltaY = e.clientY - this.lastMouseY;
    
    this.rotationY += deltaX * 0.01;
    this.rotationX += deltaY * 0.01;
    
    // Limit vertical rotation
    this.rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotationX));
    
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
    
    this.render();
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onWheel(e) {
    e.preventDefault();
    this.fov += e.deltaY * 0.01;
    this.fov = Math.max(30, Math.min(120, this.fov));
    this.render();
  }

  onTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this.isDragging = true;
    this.lastMouseX = touch.clientX;
    this.lastMouseY = touch.clientY;
  }

  onTouchMove(e) {
    e.preventDefault();
    if (!this.isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.lastMouseX;
    const deltaY = touch.clientY - this.lastMouseY;
    
    this.rotationY += deltaX * 0.01;
    this.rotationX += deltaY * 0.01;
    
    this.rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotationX));
    
    this.lastMouseX = touch.clientX;
    this.lastMouseY = touch.clientY;
    
    this.render();
  }

  onTouchEnd(e) {
    e.preventDefault();
    this.isDragging = false;
  }

  addHotspot(x, y, z, label, onClick) {
    this.hotspots.push({ x, y, z, label, onClick });
  }

  render() {
    const { canvas, ctx, image } = this;
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Render panorama
    this.renderPanorama();
    
    // Render hotspots
    this.renderHotspots();
  }

  renderPanorama() {
    const { canvas, ctx, image } = this;
    const width = canvas.width;
    const height = canvas.height;
    
    // Create equirectangular projection
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Convert screen coordinates to spherical coordinates
        const theta = (x / width) * 2 * Math.PI - Math.PI + this.rotationY;
        const phi = (y / height) * Math.PI - Math.PI / 2 + this.rotationX;
        
        // Convert to 3D coordinates
        const px = Math.cos(phi) * Math.sin(theta);
        const py = Math.sin(phi);
        const pz = Math.cos(phi) * Math.cos(theta);
        
        // Convert to texture coordinates
        const u = (Math.atan2(px, pz) + Math.PI) / (2 * Math.PI);
        const v = (Math.asin(py) + Math.PI / 2) / Math.PI;
        
        // Sample from panorama image
        const imgX = Math.floor(u * image.width);
        const imgY = Math.floor(v * image.height);
        
        const imgIndex = (imgY * image.width + imgX) * 4;
        const dataIndex = (y * width + x) * 4;
        
        data[dataIndex] = image.data[imgIndex];     // R
        data[dataIndex + 1] = image.data[imgIndex + 1]; // G
        data[dataIndex + 2] = image.data[imgIndex + 2]; // B
        data[dataIndex + 3] = 255; // A
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }

  renderHotspots() {
    const { canvas, ctx } = this;
    const width = canvas.width;
    const height = canvas.height;
    
    this.hotspots.forEach(hotspot => {
      // Convert 3D position to screen coordinates
      const screenPos = this.worldToScreen(hotspot.x, hotspot.y, hotspot.z);
      
      if (screenPos) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, 20, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw label
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(hotspot.label, screenPos.x, screenPos.y - 30);
      }
    });
  }

  worldToScreen(x, y, z) {
    // Simple perspective projection
    const fov = this.fov * Math.PI / 180;
    const aspect = this.canvas.width / this.canvas.height;
    
    // Apply rotations
    const cosX = Math.cos(this.rotationX);
    const sinX = Math.sin(this.rotationX);
    const cosY = Math.cos(this.rotationY);
    const sinY = Math.sin(this.rotationY);
    
    // Rotate around Y axis
    let rx = x * cosY - z * sinY;
    let ry = y;
    let rz = x * sinY + z * cosY;
    
    // Rotate around X axis
    let rxx = rx;
    let ryy = ry * cosX - rz * sinX;
    let rzz = ry * sinX + rz * cosX;
    
    // Check if point is in front of camera
    if (rzz <= 0) return null;
    
    // Project to screen
    const scale = 1 / Math.tan(fov / 2);
    const screenX = (rxx * scale / rzz) * this.canvas.width / 2 + this.canvas.width / 2;
    const screenY = (ryy * scale / rzz) * this.canvas.height / 2 + this.canvas.height / 2;
    
    return { x: screenX, y: screenY };
  }

  destroy() {
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('mouseup', this.onMouseUp);
    this.canvas.removeEventListener('wheel', this.onWheel);
    this.canvas.removeEventListener('touchstart', this.onTouchStart);
    this.canvas.removeEventListener('touchmove', this.onTouchMove);
    this.canvas.removeEventListener('touchend', this.onTouchEnd);
  }
}

const PanoramaViewer = ({ floorplanData, currentRoom, onRoomChange, onClose }) => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Extract rooms from floorplan data
    if (floorplanData?.objects) {
      const extractedRooms = floorplanData.objects
        .filter(obj => obj.roomType)
        .map((room, index) => ({
          id: room.roomId || `room_${index}`,
          name: room.roomType,
          position: { x: room.left || 0, y: 0, z: room.top || 0 },
          dimensions: { width: room.width || 4, height: room.height || 3 }
        }));
      setRooms(extractedRooms);
    }
  }, [floorplanData]);

  useEffect(() => {
    if (rooms.length > 0 && canvasRef.current) {
      initializePanorama();
    }
  }, [rooms]);

  const initializePanorama = async () => {
    try {
      setLoading(true);
      
      // Create a sample panorama image (in real app, this would be generated from 3D scene)
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      // Create sample panorama
      const panoramaImage = await createSamplePanorama(canvas.width, canvas.height);
      
      // Initialize renderer
      rendererRef.current = new PanoramaRenderer(canvas, panoramaImage);
      
      // Add hotspots for room navigation
      rooms.forEach((room, index) => {
        rendererRef.current.addHotspot(
          room.position.x,
          room.position.y,
          room.position.z,
          room.name,
          () => navigateToRoom(index)
        );
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to initialize panorama:', error);
      setLoading(false);
    }
  };

  const createSamplePanorama = (width, height) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      // Create a gradient-based panorama
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#87CEEB'); // Sky blue
      gradient.addColorStop(0.7, '#98FB98'); // Pale green
      gradient.addColorStop(1, '#8FBC8F'); // Dark sea green
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Add some simple room elements
      ctx.fillStyle = '#D2B48C';
      ctx.fillRect(width * 0.2, height * 0.6, width * 0.6, height * 0.4);
      
      // Add windows
      ctx.fillStyle = '#87CEEB';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(width * (0.3 + i * 0.2), height * 0.2, width * 0.1, height * 0.3);
      }
      
      resolve(canvas);
    });
  };

  const navigateToRoom = (roomIndex) => {
    if (roomIndex >= 0 && roomIndex < rooms.length) {
      setCurrentRoomIndex(roomIndex);
      if (onRoomChange) {
        onRoomChange(rooms[roomIndex]);
      }
    }
  };

  const nextRoom = () => {
    const nextIndex = (currentRoomIndex + 1) % rooms.length;
    navigateToRoom(nextIndex);
  };

  const prevRoom = () => {
    const prevIndex = (currentRoomIndex - 1 + rooms.length) % rooms.length;
    navigateToRoom(prevIndex);
  };

  useEffect(() => {
    return () => {
      if (rendererRef.current) {
        rendererRef.current.destroy();
      }
    };
  }, []);

  if (loading) {
    return (
      <PanoramaContainer>
        <LoadingOverlay>
          <div>Loading 360° view...</div>
        </LoadingOverlay>
      </PanoramaContainer>
    );
  }

  return (
    <PanoramaContainer>
      <PanoramaCanvas ref={canvasRef} />
      
      <Controls>
        <ControlButton onClick={() => setLoading(true)}>
          🔄 Refresh
        </ControlButton>
        <ControlButton onClick={onClose}>
          ✕ Close
        </ControlButton>
      </Controls>

      {rooms.length > 0 && (
        <RoomInfo>
          <div><strong>Current Room:</strong> {rooms[currentRoomIndex]?.name}</div>
          <div><strong>Room {currentRoomIndex + 1} of {rooms.length}</strong></div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
            Click hotspots to navigate between rooms
          </div>
        </RoomInfo>
      )}

      <Navigation>
        <NavButton onClick={prevRoom} disabled={rooms.length <= 1}>
          ←
        </NavButton>
        <NavButton onClick={nextRoom} disabled={rooms.length <= 1}>
          →
        </NavButton>
      </Navigation>

      {/* Hotspots */}
      {rooms.map((room, index) => (
        <Hotspot
          key={room.id}
          style={{
            left: `${50 + room.position.x * 10}%`,
            top: `${50 + room.position.z * 10}%`,
          }}
          onClick={() => navigateToRoom(index)}
          title={`Go to ${room.name}`}
        >
          {index + 1}
        </Hotspot>
      ))}
    </PanoramaContainer>
  );
};

export default PanoramaViewer;
