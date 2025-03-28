// src/app/store/useGameStore.ts
import { create } from 'zustand';
import { Tile, TileProperties, Building, BuildingProperties } from '@/app/utils/isometricUtils';

// Define the store state interface
interface GameState {
  // Grid state
  gridSize: number;
  tileSize: number;
  selectedTiles: string[];
  hoveredTile: string | null;
  grid: Tile[];

  // Building state
  buildings: Record<string, Building>;
  currentBuildingType: string | null;

  // Game state
  resources: Record<string, number>;
  gameStage: 'building' | 'wave' | 'gameover';
  waveNumber: number;
  enemies: any[]; // We'll type this properly when we implement enemies
  playerHealth: number;

  // Constants
  BUILDING_TYPES: Record<string, BuildingProperties>;
  TILE_TYPES: Record<string, TileProperties>;

  // Actions
  initializeGrid: () => void;
  setHoveredTile: (tileId: string | null) => void;
  selectTile: (tileId: string) => void;
  clearSelection: () => void;
  selectBuildingType: (buildingType: string | null) => void;
  placeBuilding: () => boolean;
  addResources: (resourceUpdate: Record<string, number>) => void;
  startWave: () => void;
  endWave: () => void;
  damagePlayer: (amount: number) => void;
  resetGame: () => void;
}

// Building types and their properties
const BUILDING_TYPES: Record<string, BuildingProperties> = {
  WALL: {
    id: 'wall',
    name: 'Wall',
    cost: { stone: 10 },
    health: 50,
    size: [1, 1], // width, depth
    model: 'wall'
  },
  TOWER: {
    id: 'tower',
    name: 'Arrow Tower',
    cost: { stone: 30, wood: 15 },
    health: 80,
    damage: 10,
    range: 3,
    attackSpeed: 1.5,
    size: [1, 1],
    model: 'tower'
  },
  HOUSE: {
    id: 'house',
    name: 'House',
    cost: { wood: 20 },
    generates: { gold: 5 },
    health: 30,
    size: [1, 1],
    model: 'house'
  }
};

// Tile types for the grid
const TILE_TYPES: Record<string, TileProperties> = {
  GRASS: { id: 'grass', buildable: true, walkable: true },
  WATER: { id: 'water', buildable: false, walkable: false },
  STONE: { id: 'stone', buildable: true, walkable: true, resource: 'stone' },
  TREE: { id: 'tree', buildable: true, walkable: true, resource: 'wood' }
};

// Initial resources
const INITIAL_RESOURCES: Record<string, number> = {
  gold: 100,
  wood: 50,
  stone: 50
};

// Create the Zustand store
const useGameStore = create<GameState>((set, get) => ({
  // Grid state
  gridSize: 10,
  tileSize: 1,
  selectedTiles: [],
  hoveredTile: null,
  grid: [], // Will hold tile type information for each position

  // Building state
  buildings: {}, // key: tileId, value: building object
  currentBuildingType: null,

  // Game state
  resources: { ...INITIAL_RESOURCES },
  gameStage: 'building', // building, wave, gameover
  waveNumber: 0,
  enemies: [],
  playerHealth: 100,

  // Constants
  BUILDING_TYPES,
  TILE_TYPES,

  // Initialize the grid
  initializeGrid: () => {
    const grid: Tile[] = [];
    const { gridSize } = get();
    
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        // Default to grass tiles
        let tileType = 'grass';
        
        // Add some random resource tiles
        const random = Math.random();
        if (random > 0.9) tileType = 'stone';
        else if (random > 0.8) tileType = 'tree';
        else if (random > 0.95) tileType = 'water';
        
        const tileTypeKey = tileType.toUpperCase() as keyof typeof TILE_TYPES;
        
        grid.push({
          id: `${x}-${z}`,
          position: [x, z],
          type: tileType,
          properties: { ...TILE_TYPES[tileTypeKey] }
        });
      }
    }
    
    set({ grid });
  },

  // Selection management
  setHoveredTile: (tileId) => set({ hoveredTile: tileId }),
  
  selectTile: (tileId) => {
    const { selectedTiles } = get();
    if (selectedTiles.includes(tileId)) {
      set({ selectedTiles: selectedTiles.filter(id => id !== tileId) });
    } else {
      set({ selectedTiles: [...selectedTiles, tileId] });
    }
  },

  clearSelection: () => set({ selectedTiles: [] }),

  // Building management
  selectBuildingType: (buildingType) => set({ currentBuildingType: buildingType }),
  
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
      currentBuildingType: null
    });
    
    return true;
  },
  
  // Resource management
  addResources: (resourceUpdate) => {
    const { resources } = get();
    set({
      resources: Object.entries(resourceUpdate).reduce((acc, [key, value]) => {
        acc[key] = (resources[key] || 0) + value;
        return acc;
      }, { ...resources })
    });
  },

  // Game state management
  startWave: () => {
    set({ gameStage: 'wave', waveNumber: get().waveNumber + 1 });
    // Here you would spawn enemies based on wave number
  },
  
  endWave: () => {
    set({ gameStage: 'building', enemies: [] });
  },
  
  damagePlayer: (amount) => {
    const newHealth = get().playerHealth - amount;
    set({
      playerHealth: newHealth,
      gameStage: newHealth <= 0 ? 'gameover' : get().gameStage
    });
  },
  
  resetGame: () => {
    set({
      resources: { ...INITIAL_RESOURCES },
      buildings: {},
      selectedTiles: [],
      waveNumber: 0,
      playerHealth: 100,
      gameStage: 'building',
      enemies: []
    });
    get().initializeGrid();
  }
}));

export default useGameStore;