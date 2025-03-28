"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import useGameStore from "../../store";

export function MapTile() {
  const {
    grid,
    gridSize,
    hoveredTile,
    selectedTiles,
    selectTile,
    setHoveredTile,
    buildMode,
    currentBuildingType,
    buildings
  } = useGameStore();
  
  const mapRef = useRef<THREE.Mesh>(null);
  
  // Create a grid of cells for interaction
  const gridCells = useMemo(() => {
    if (!grid.length) return [];
    
    return grid.map(tile => {
      const [x, z] = tile.position;
      
      const isHovered = hoveredTile === tile.id;
      const isSelected = selectedTiles.includes(tile.id);
      const isOccupied = Boolean(buildings[tile.id]);
      
      // Get tile color based on type and state
      const getTileBaseColor = () => {
        switch (tile.type) {
          case "grass": return "#7cb342";
          case "water": return "#42a5f5";
          case "stone": return "#9e9e9e";
          case "tree": return "#558b2f";
          default: return "#7cb342";
        }
      };
      
      let tileColor = getTileBaseColor();
      
      // Determine the correct color based on state and build mode
      if (isOccupied) {
        // Already has a building, make it slightly darker
        tileColor = "#5d4037";
      } else if (buildMode === 'painting' && currentBuildingType === 'wall') {
        // In wall painting mode
        if (isHovered && tile.properties.buildable) {
          tileColor = "#ff9800"; // Orange highlight for valid wall placement
        }
      } else {
        // Normal selection mode
        if (isSelected) {
          tileColor = "#4caf50"; // Green for selected
        } else if (isHovered) {
          tileColor = "#ffeb3b"; // Yellow for hover
        }
      }
      
      const isTileBuildable = tile.properties?.buildable !== false;
      
      return (
        <mesh
          key={tile.id}
          position={[x, 0.01, z]}
          rotation={[-Math.PI / 2, 0, 0]}
          userData={{ tileId: tile.id }}
          onClick={(e) => {
            e.stopPropagation();
            selectTile(tile.id);
          }}
        >
          <planeGeometry args={[0.95, 0.95]} />
          <meshStandardMaterial 
            color={tileColor}
            transparent={true}
            opacity={isTileBuildable ? 0.8 : 0.5}
            roughness={0.7}
          />
        </mesh>
      );
    });
  }, [grid, hoveredTile, selectedTiles, buildMode, currentBuildingType, buildings, selectTile]);
  
  // Add resource indicators
  const resourceIndicators = useMemo(() => {
    if (!grid.length) return [];
    
    return grid.map(tile => {
      const [x, z] = tile.position;
      
      // Skip if there's a building on this tile
      if (buildings[tile.id]) {
        return null;
      }
      
      if (tile.type === "stone") {
        return (
          <mesh 
            key={`${tile.id}-resource`} 
            position={[x, 0.15, z]} 
            scale={[0.3, 0.3, 0.3]}
          >
            <dodecahedronGeometry />
            <meshStandardMaterial color="#bdbdbd" roughness={0.8} />
          </mesh>
        );
      } else if (tile.type === "tree") {
        return (
          <group key={`${tile.id}-resource`} position={[x, 0, z]}>
            <mesh position={[0, 0.3, 0]} scale={[0.2, 0.4, 0.2]}>
              <cylinderGeometry />
              <meshStandardMaterial color="#795548" />
            </mesh>
            <mesh position={[0, 0.7, 0]} scale={[0.5, 0.5, 0.5]}>
              <coneGeometry />
              <meshStandardMaterial color="#33691e" />
            </mesh>
          </group>
        );
      } else if (tile.type === "water") {
        return (
          <mesh 
            key={`${tile.id}-resource`} 
            position={[x, 0.05, z]} 
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.95, 0.95]} />
            <meshStandardMaterial
              color="#29b6f6"
              transparent={true}
              opacity={0.8}
              roughness={0.1}
            />
          </mesh>
        );
      }
      return null;
    }).filter(Boolean);
  }, [grid, buildings]);
  
  // Handle pointer events for hover effects
  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (event.intersections.length > 0) {
      const intersectedObject = event.intersections[0].object;
      const userData = intersectedObject.userData as { tileId?: string };
      if (userData?.tileId) {
        setHoveredTile(userData.tileId);
      }
    } else {
      setHoveredTile(null);
    }
  };
  
  // Calculate the size for the base map
  const mapSize = gridSize; // Make the map the same size as the grid
  
  // Center offset for the grid (since grid starts at 0,0 in corner)
  const offsetX = gridSize / 2 - 0.5;
  const offsetZ = gridSize / 2 - 0.5;
  
  return (
    <group onPointerMove={handlePointerMove}>
      {/* Base map floor */}
      <mesh 
        ref={mapRef}
        position={[0, 0, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[mapSize, mapSize]} />
        <meshStandardMaterial color="#1b5e20" />
      </mesh>
      
      {/* Grid with interactive cells */}
      <group position={[-offsetX, 0, -offsetZ]}>
        {gridCells}
        {resourceIndicators}
      </group>
    </group>
  );
}