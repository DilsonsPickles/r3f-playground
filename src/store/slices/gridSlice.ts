// src/store/slices/gridSlice.ts
import { StateCreator } from 'zustand';
import { RootState, GridState, Tile } from '../types';
import { DEFAULT_GRID_SIZE, DEFAULT_TILE_SIZE, TILE_TYPES } from '../constants';

export interface GridActions {
  initializeGrid: () => void;
  setHoveredTile: (tileId: string | null) => void;
  selectTile: (tileId: string) => void;
  clearSelection: () => void;
  getCorePosition: () => [number, number];
}

export type GridSlice = GridState & GridActions;

export const createGridSlice: StateCreator<
  RootState,
  [],
  [],
  GridSlice
> = (set, get) => ({
  // Initial state
  gridSize: DEFAULT_GRID_SIZE,
  tileSize: DEFAULT_TILE_SIZE,
  selectedTiles: [],
  hoveredTile: null,
  grid: [],

  // Actions
  initializeGrid: () => {
    const grid: Tile[] = [];
    const { gridSize } = get();
    const centerX = Math.floor(gridSize / 2);
    const centerZ = Math.floor(gridSize / 2);
    
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        // Default to grass tiles
        let tileType = 'grass';
        let isBuildable = true;
        
        // Core area is not buildable (5x5 area in center for the keep)
        if (Math.abs(x - centerX) <= 2 && Math.abs(z - centerZ) <= 2) {
          isBuildable = false;
        } else {
          // Add some random resource tiles outside the core area
          const random = Math.random();
          if (random > 0.95) tileType = 'stone';
          else if (random > 0.9) tileType = 'tree';
          else if (random > 0.97) tileType = 'water';
        }
        
        const tileTypeKey = tileType.toUpperCase() as keyof typeof TILE_TYPES;
        
        grid.push({
          id: `${x}-${z}`,
          position: [x, z],
          type: tileType,
          properties: { 
            ...TILE_TYPES[tileTypeKey],
            buildable: isBuildable 
          }
        });
      }
    }
    
    set({ grid });
  },

  setHoveredTile: (tileId) => set({ hoveredTile: tileId }),
  
  selectTile: (tileId) => {
    const { selectedTiles, buildMode, currentBuildingType } = get();
    
    // If in painting mode, paint a wall instead of selecting
    if (buildMode === 'painting' && currentBuildingType === 'wall') {
      get().paintWall(tileId);
      return;
    }
    
    // Regular selection logic
    if (selectedTiles.includes(tileId)) {
      set({ selectedTiles: selectedTiles.filter(id => id !== tileId) });
    } else {
      set({ selectedTiles: [...selectedTiles, tileId] });
    }
  },

  clearSelection: () => set({ 
    selectedTiles: []
  }),

  getCorePosition: () => {
    const { gridSize } = get();
    return [Math.floor(gridSize / 2), Math.floor(gridSize / 2)] as [number, number];
  }
});