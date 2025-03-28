// src/store/index.ts
import { create } from 'zustand';
import { RootState } from './types';
import { BUILDING_TYPES, TILE_TYPES } from './constants';

// Import slices
import { createGridSlice, GridSlice } from './slices/gridSlice';
import { createBuildingSlice, BuildingSlice } from './slices/buildingSlice';
import { createResourceSlice, ResourceSlice } from './slices/resourceSlice';
import { createCoreSlice, CoreSlice } from './slices/coreSlice';
import { createGameStateSlice, GameStateSlice } from './slices/gameStateSlice';

// Define the store type with all slices
type GameStore = GridSlice & BuildingSlice & ResourceSlice & CoreSlice & GameStateSlice & {
  // Constants
  BUILDING_TYPES: typeof BUILDING_TYPES;
  TILE_TYPES: typeof TILE_TYPES;
  
  // Combined actions
  resetGame: () => void;
  clearSelection: () => void; // Combined clear action for both grid and building selections
};

// Create the combined store
const useGameStore = create<GameStore>((set, get) => ({
  // Include all slices
  ...createGridSlice(set, get),
  ...createBuildingSlice(set, get),
  ...createResourceSlice(set, get),
  ...createCoreSlice(set, get),
  ...createGameStateSlice(set, get),
  
  // Constants
  BUILDING_TYPES,
  TILE_TYPES,
  
  // Combined actions
  resetGame: () => {
    // Call individual reset functions from each slice
    get().resetGameState();
    get().resetResources();
    get().resetCore();
    
    // Reset buildings
    set({ buildings: {} });
    
    // Reset selection state
    get().clearSelection();
    
    // Reinitialize grid
    get().initializeGrid();
  },
  
  // Combined clear selection that handles both grid and building state
  clearSelection: () => {
    get().clearBuildingSelection(); // From building slice
    set({ 
      selectedTiles: [],  // From grid slice
      currentBuildingType: null,
      buildMode: 'normal'
    });
  }
}));

export default useGameStore;