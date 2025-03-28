"use client";
import { Canvas } from "@react-three/fiber";
import { useRef, useState, useMemo, useEffect } from "react";
import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei";
import * as THREE from "three";


// Import our Zustand store
import useGameStore from "../store/useGameStore";

// Constants for isometric view
const ISOMETRIC_ANGLE = Math.PI / 4; // 45 degrees in radians

// Helper to convert grid coordinates to isometric view coordinates
function cartesianToIsometric(x, z) {
  return [
    (x - z) * Math.cos(ISOMETRIC_ANGLE),
    (x + z) * Math.sin(ISOMETRIC_ANGLE)
  ];
}

// Individual grid tile component
function GridTile({ tile, isHovered, isSelected, onTileClick }) {
  // Get reference to meshes for animation
  const meshRef = useRef();
  
  // Determine colors based on tile type and state
  const getTileBaseColor = () => {
    switch(tile.type) {
      case 'grass': return "#7cb342";
      case 'water': return "#42a5f5";
      case 'stone': return "#9e9e9e";
      case 'tree': return "#558b2f";
      default: return "#7cb342";
    }
  };

  const tileColor = isSelected ? "#4caf50" : isHovered ? "#ffeb3b" : getTileBaseColor();
  const height = isSelected ? 0.1 : 0.05;
  
  // Calculate isometric position
  const [isoX, isoZ] = cartesianToIsometric(tile.position[0], tile.position[1]);
  
  // Add visual elements based on tile type
  const ResourceIndicator = () => {
    if (tile.type === 'stone') {
      return (
        <mesh position={[0, 0.15, 0]} scale={[0.3, 0.3, 0.3]}>
          <dodecahedronGeometry />
          <meshStandardMaterial color="#bdbdbd" roughness={0.8} />
        </mesh>
      );
    } else if (tile.type === 'tree') {
      return (
        <group position={[0, 0.3, 0]}>
          <mesh position={[0, 0.1, 0]} scale={[0.2, 0.4, 0.2]}>
            <cylinderGeometry />
            <meshStandardMaterial color="#795548" />
          </mesh>
          <mesh position={[0, 0.4, 0]} scale={[0.5, 0.5, 0.5]}>
            <coneGeometry />
            <meshStandardMaterial color="#33691e" />
          </mesh>
        </group>
      );
    }
    return null;
  };
  
  // Check if tile is buildable
  const isTileBuildable = tile.properties?.buildable !== false;
  
  return (
    <group position={[isoX, 0, isoZ]}>
      <mesh 
        ref={meshRef}
        position={[0, height / 2, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => onTileClick(tile.id)}
        userData={{ tileId: tile.id }}
      >
        <planeGeometry args={[0.95, 0.95]} />
        <meshStandardMaterial 
          color={tileColor} 
          transparent={true} 
          opacity={isTileBuildable ? 0.8 : 0.5}
          roughness={0.7}
        />
      </mesh>
      
      {/* Add visual indicators for tile type */}
      <ResourceIndicator />
    </group>
  );
}

// Building visualization component
function Building({ building, position }) {
  const buildingType = building.type;
  const [isoX, isoZ] = cartesianToIsometric(position[0], position[1]);
  
  // Different 3D models based on building type
  const BuildingModel = () => {
    switch(buildingType) {
      case 'wall':
        return (
          <mesh position={[0, 0.3, 0]} scale={[0.8, 0.6, 0.8]}>
            <boxGeometry />
            <meshStandardMaterial color="#795548" />
          </mesh>
        );
      case 'tower':
        return (
          <group>
            <mesh position={[0, 0.4, 0]} scale={[0.8, 0.8, 0.8]}>
              <boxGeometry />
              <meshStandardMaterial color="#795548" />
            </mesh>
            <mesh position={[0, 0.9, 0]} scale={[0.6, 0.2, 0.6]}>
              <cylinderGeometry />
              <meshStandardMaterial color="#4e342e" />
            </mesh>
            <mesh position={[0, 1.1, 0]} scale={[0.7, 0.1, 0.7]}>
              <cylinderGeometry />
              <meshStandardMaterial color="#5d4037" />
            </mesh>
          </group>
        );
      case 'house':
        return (
          <group>
            <mesh position={[0, 0.3, 0]} scale={[0.8, 0.6, 0.8]}>
              <boxGeometry />
              <meshStandardMaterial color="#e57373" />
            </mesh>
            <mesh position={[0, 0.8, 0]} rotation={[0, Math.PI / 4, 0]} scale={[0.9, 0.4, 0.9]}>
              <coneGeometry />
              <meshStandardMaterial color="#c62828" />
            </mesh>
          </group>
        );
      default:
        return (
          <mesh position={[0, 0.3, 0]} scale={[0.5, 0.5, 0.5]}>
            <boxGeometry />
            <meshStandardMaterial color="#9e9e9e" />
          </mesh>
        );
    }
  };
  
  return (
    <group position={[isoX, 0, isoZ]}>
      <BuildingModel />
    </group>
  );
}

// The main isometric grid component
function IsometricGrid() {
  // Get state from our Zustand store
  const { 
    grid, 
    hoveredTile, 
    selectedTiles, 
    buildings,
    setHoveredTile, 
    selectTile, 
    initializeGrid
  } = useGameStore();
  
  // Initialize grid on component mount
  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);
  
  // Handle tile click
  const handleTileClick = (tileId) => {
    selectTile(tileId);
  };
  
  // Handle raycasting for hover effects
  const handlePointerMove = (event) => {
    if (event.intersections.length > 0) {
      const intersectedObject = event.intersections[0].object;
      if (intersectedObject.userData?.tileId) {
        setHoveredTile(intersectedObject.userData.tileId);
      }
    } else {
      setHoveredTile(null);
    }
  };
  
  return (
    <group position={[0, 0, 0]} onPointerMove={handlePointerMove}>
      {/* Base plane for visual context */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2e7d32" transparent opacity={0.3} />
      </mesh>
      
      {/* Render grid tiles */}
      {grid.map((tile) => (
        <GridTile
          key={tile.id}
          tile={tile}
          isHovered={hoveredTile === tile.id}
          isSelected={selectedTiles.includes(tile.id)}
          onTileClick={handleTileClick}
        />
      ))}
      
      {/* Render buildings */}
      {Object.values(buildings).map((building) => {
        const tileId = building.tileId;
        const tile = grid.find(t => t.id === tileId);
        if (!tile) return null;
        
        return (
          <Building 
            key={building.id} 
            building={building} 
            position={tile.position} 
          />
        );
      })}
    </group>
  );
}

// Resource display component in 3D space
function ResourceDisplay() {
  const resources = useGameStore(state => state.resources);
  
  return (
    <group position={[-5, 5, -5]}>
      <Text
        position={[0, 0, 0]}
        color="white"
        fontSize={0.5}
        anchorX="left"
        anchorY="middle"
      >
        {`Gold: ${resources.gold} | Wood: ${resources.wood} | Stone: ${resources.stone}`}
      </Text>
    </group>
  );
}

// User interface for building selection
function BuildingUI() {
  const { 
    BUILDING_TYPES, 
    currentBuildingType, 
    selectBuildingType, 
    placeBuilding,
    clearSelection 
  } = useGameStore();
  
  const handleBuildingSelect = (buildingType) => {
    selectBuildingType(buildingType);
  };
  
  const handlePlaceBuilding = () => {
    placeBuilding();
  };
  
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '0',
      right: '0',
      display: 'flex',
      justifyContent: 'center',
      gap: '10px'
    }}>
      {Object.values(BUILDING_TYPES).map(building => (
        <button
          key={building.id}
          onClick={() => handleBuildingSelect(building.id)}
          style={{
            padding: '10px',
            background: currentBuildingType === building.id ? '#4caf50' : '#333',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {building.name} 
          <span style={{ fontSize: '0.8em', display: 'block' }}>
            {Object.entries(building.cost).map(([resource, amount]) => 
              `${resource}: ${amount}`
            ).join(', ')}
          </span>
        </button>
      ))}
      
      <button
        onClick={handlePlaceBuilding}
        style={{
          padding: '10px',
          background: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Build
      </button>
      
      <button
        onClick={clearSelection}
        style={{
          padding: '10px',
          background: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Cancel
      </button>
    </div>
  );
}

// Resource display UI component
function ResourceUI() {
  const resources = useGameStore(state => state.resources);
  
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      padding: '10px',
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      borderRadius: '5px'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>Resources</h3>
      <div>Gold: {resources.gold}</div>
      <div>Wood: {resources.wood}</div>
      <div>Stone: {resources.stone}</div>
    </div>
  );
}

// Main game component
export default function IsometricTowerDefense() {
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Canvas shadows>
        {/* Set up camera for isometric view */}
        <PerspectiveCamera 
          makeDefault 
          position={[10, 10, 10]} 
          fov={45}
          near={0.1}
          far={1000}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />
        
        {/* Main grid with game elements */}
        <IsometricGrid />
        
        {/* 3D text display for resources */}
        <ResourceDisplay />
        
        {/* Controls - limit rotation to maintain isometric feel */}
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 3}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
      </Canvas>
      
      {/* UI Overlays */}
      <ResourceUI />
      <BuildingUI />
    </div>
  );
}