// src/app/components/ui/BuildingUI.tsx
"use client";
import { useState } from "react";
import useGameStore from "../../store";

// User interface for building selection
export function BuildingUI() {
  const { 
    BUILDING_TYPES, 
    currentBuildingType, 
    selectBuildingType, 
    placeBuilding,
    clearSelection,
    gameStage,
    buildMode,
    resources
  } = useGameStore();
  
  // Check if we have enough resources for a particular building
  const canAffordBuilding = (buildingType: string) => {
    const buildingConfig = Object.values(BUILDING_TYPES).find(b => b.id === buildingType);
    if (!buildingConfig) return false;
    
    return Object.entries(buildingConfig.cost).every(([resource, amount]) => 
      (resources[resource] || 0) >= amount
    );
  };
  
  // Toggle wall painting mode
  const handleWallPaintingSelect = () => {
    if (currentBuildingType === 'wall' && buildMode === 'painting') {
      // Turn off wall painting mode
      clearSelection();
    } else {
      // Turn on wall painting mode
      selectBuildingType('wall');
    }
  };
  
  // Handle regular building selection
  const handleBuildingSelect = (buildingType: string) => {
    // Don't allow selecting if we can't afford it
    if (!canAffordBuilding(buildingType)) return;
    
    if (buildingType === 'wall') {
      handleWallPaintingSelect();
    } else {
      selectBuildingType(buildingType);
    }
  };
  
  // Handle building placement
  const handlePlaceBuilding = () => {
    placeBuilding();
  };

  // Don't render during wave phase
  if (gameStage !== 'building') {
    return null;
  }
  
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
      {/* Wall painting mode button */}
      <button
        onClick={() => handleBuildingSelect('wall')}
        style={{
          padding: '10px',
          background: currentBuildingType === 'wall' && buildMode === 'painting' 
            ? '#ff9800' // Orange when active
            : canAffordBuilding('wall') ? '#333' : '#888', // Grey out if can't afford
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: canAffordBuilding('wall') ? 'pointer' : 'not-allowed',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        disabled={!canAffordBuilding('wall')}
      >
        <span>Paint Wall</span>
        <span style={{ fontSize: '0.8em', display: 'block' }}>
          {Object.entries(BUILDING_TYPES.WALL.cost).map(([resource, amount]) => 
            `${resource}: ${amount}`
          ).join(', ')}
        </span>
        {currentBuildingType === 'wall' && buildMode === 'painting' && (
          <span style={{ fontSize: '0.8em', color: '#ffeb3b' }}>Active</span>
        )}
      </button>
      
      {/* Other building types */}
      {Object.values(BUILDING_TYPES)
        .filter(building => building.id !== 'wall') // Skip wall, we have a special button for it
        .map(building => (
          <button
            key={building.id}
            onClick={() => handleBuildingSelect(building.id)}
            style={{
              padding: '10px',
              background: currentBuildingType === building.id ? '#4caf50' : 
                          canAffordBuilding(building.id) ? '#333' : '#888',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: canAffordBuilding(building.id) ? 'pointer' : 'not-allowed',
            }}
            disabled={!canAffordBuilding(building.id)}
          >
            {building.name} 
            <span style={{ fontSize: '0.8em', display: 'block' }}>
              {Object.entries(building.cost).map(([resource, amount]) => 
                `${resource}: ${amount}`
              ).join(', ')}
            </span>
          </button>
        ))}
      
      {/* Only show these buttons when in normal selection mode */}
      {buildMode === 'normal' && currentBuildingType && (
        <>
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
        </>
      )}
      
      {/* Cancel button for paint mode */}
      {buildMode === 'painting' && (
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
          Exit Paint Mode
        </button>
      )}
    </div>
  );
}