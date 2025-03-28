"use client";
import { useEffect } from "react";
import useGameStore from "../../store";
import { MapTile } from "./MapTile";
import { Building } from "./Building";
import { CoreStructure } from "./BasicTierKeep";

export function GameMap() {
  const { 
    grid, 
    buildings,
    gridSize,
    initializeGrid
  } = useGameStore();
  
  // Initialize grid on component mount
  useEffect(() => {
    if (grid.length === 0) {
      initializeGrid();
    }
  }, [grid.length, initializeGrid]);
  
  // Calculate center offset for proper positioning
  const offsetX = gridSize / 2 - 0.5;
  const offsetZ = gridSize / 2 - 0.5;
  
  return (
    <group>
      {/* Map with grid cells */}
      <MapTile />
      
      {/* Core structure to defend */}
      <group position={[-offsetX, 0, -offsetZ]}>
        <CoreStructure />
      </group>
      
      {/* Buildings */}
      <group position={[-offsetX, 0, -offsetZ]}>
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
    </group>
  );
}