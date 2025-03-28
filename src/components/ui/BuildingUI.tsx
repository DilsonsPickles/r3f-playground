// src/app/components/ui/BuildingUI.tsx
"use client";
import useGameStore from "../../store/useGameStore";

// User interface for building selection
export function BuildingUI() {
  const { 
    BUILDING_TYPES, 
    currentBuildingType, 
    selectBuildingType, 
    placeBuilding,
    clearSelection,
    gameStage
  } = useGameStore();
  
  const handleBuildingSelect = (buildingType: string) => {
    selectBuildingType(buildingType);
  };
  
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