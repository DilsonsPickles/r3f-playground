// src/store/slices/buildingSlice.ts
import { StateCreator } from 'zustand';
import { RootState, BuildingState, Building } from '../types';
import { BUILDING_TYPES } from '../constants';

export interface BuildingActions {
  selectBuildingType: (buildingType: string | null) => void;
  setBuildMode: (mode: 'normal' | 'painting') => void;
  placeBuilding: () => boolean;
  paintWall: (tileId: string) => boolean;
  clearBuildingSelection: () => void;
}

export type BuildingSlice = BuildingState & BuildingActions;

export const createBuildingSlice: StateCreator<
  RootState,
  [],
  [],
  BuildingSlice
> = (set, get) => ({
  // Initial state
  buildings: {},
  currentBuildingType: null,
  buildMode: 'normal',

  // Actions
  selectBuildingType: (buildingType) => {
    // If selecting wall, automatically go into painting mode
    if (buildingType === 'wall') {
      set({ 
        currentBuildingType: buildingType,
        buildMode: 'painting',
        selectedTiles: [] // Clear any existing selection
      });
    } else {
      set({ 
        currentBuildingType: buildingType,
        buildMode: 'normal'
      });
    }
  },
  
  setBuildMode: (mode) => set({ buildMode: mode }),
  
  clearBuildingSelection: () => set({
    currentBuildingType: null,
    buildMode: 'normal'
  }),
  
  // Painting walls
  paintWall: (tileId) => {
    const { resources, grid, buildings } = get();
    
    // Find the tile
    const tile = grid.find(t => t.id === tileId);
    if (!tile || !tile.properties.buildable) {
      return false; // Can't build here
    }
    
    // Check if tile is already occupied
    if (buildings[tileId]) {
      return false; // Already has a building
    }
    
    // Get wall building specification
    const wallSpec = BUILDING_TYPES.WALL;
    
    // Check if we have enough resources
    for (const [resource, amount] of Object.entries(wallSpec.cost)) {
      if ((resources[resource] || 0) < amount) {
        console.log(`Not enough ${resource} to build wall`);
        return false;
      }
    }
    
    // Deduct resources
    const newResources = { ...resources };
    for (const [resource, amount] of Object.entries(wallSpec.cost)) {
      newResources[resource] = (newResources[resource] || 0) - amount;
    }
    
    // Add the wall
    const newBuildings = { ...get().buildings };
    newBuildings[tileId] = {
      id: `wall-${Date.now()}-${tileId}`,
      type: 'wall',
      tileId,
      health: wallSpec.health,
      properties: { ...wallSpec }
    };
    
    set({
      resources: newResources,
      buildings: newBuildings
    });
    
    return true;
  },
  
  placeBuilding: () => {
    const { selectedTiles, currentBuildingType, resources, grid, buildings } = get();
    
    // Ensure we have a building type selected and tiles selected
    if (!currentBuildingType || selectedTiles.length === 0) return false;
    
    // Get building specification
    const buildingTypeKey = currentBuildingType.toUpperCase() as keyof typeof BUILDING_TYPES;
    const buildingSpec = BUILDING_TYPES[buildingTypeKey];
    
    // Check if we have enough resources
    for (const [resource, amount] of Object.entries(buildingSpec.cost)) {
      if ((resources[resource] || 0) < amount) {
        console.log(`Not enough ${resource} to build ${buildingSpec.name}`);
        return false;
      }
    }
    
    // Check if placement is valid
    for (const tileId of selectedTiles) {
      // Check if tile is already occupied
      if (buildings[tileId]) {
        console.log('Tile already occupied');
        return false;
      }
      
      // Find the tile in the grid
      const tile = grid.find(t => t.id === tileId);
      if (!tile || !tile.properties.buildable) {
        console.log('Cannot build on this tile');
        return false;
      }
    }
    
    // Deduct resources
    const newResources = { ...resources };
    for (const [resource, amount] of Object.entries(buildingSpec.cost)) {
      newResources[resource] = (newResources[resource] || 0) - amount;
    }
    
    // Add the building
    const newBuildings: Record<string, Building> = { ...buildings };
    for (const tileId of selectedTiles) {
      newBuildings[tileId] = {
        id: `${currentBuildingType}-${Date.now()}-${tileId}`,
        type: currentBuildingType,
        tileId,
        health: buildingSpec.health,
        properties: { ...buildingSpec }
      };
    }
    
    set({
      resources: newResources,
      buildings: newBuildings,
      selectedTiles: [],
      currentBuildingType: null,
      buildMode: 'normal'
    });
    
    return true;
  }
});