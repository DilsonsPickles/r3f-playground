// src/app/components/grid/IsometricGrid.tsx
"use client";
import { useEffect } from "react";
import { ThreeEvent } from "@react-three/fiber";
import useGameStore from "../../store/useGameStore";
import { GridTile } from "./GridTile";
import { Building } from "./Building";

// The main isometric grid component
export function IsometricGrid() {
  // Get state from our Zustand store
  const { 
    grid, 
    hoveredTile, 
    selectedTiles, 
    buildings,
    setHoveredTile, 
    initializeGrid
  } = useGameStore();
  
  // Initialize grid on component mount
  useEffect(() => {
    if (grid.length === 0) {
      initializeGrid();
    }
  }, [grid.length, initializeGrid]);
  
  // Handle raycasting for hover effects
  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (event.intersections.length > 0) {
      const intersectedObject = event.intersections[0].object;
      // Using type assertion for userData since it's not typed in ThreeEvent
      const userData = intersectedObject.userData as { tileId?: string };
      if (userData?.tileId) {
        setHoveredTile(userData.tileId);
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