// src/store/types.ts
// Import types from isometricUtils
import { Tile, TileProperties, Building, BuildingProperties } from '@/app/utils/isometricUtils';

// Re-export these types for use in slices
export { Tile, TileProperties, Building, BuildingProperties };

// Game stage type
export type GameStage = 'building' | 'wave' | 'gameover';

// Build mode type 
export type BuildMode = 'normal' | 'painting';

// Enemy type (basic for now, can be expanded)
export interface Enemy {
  id: string;
  type: string;
  position: [number, number];
  health: number;
  damage: number;
  speed: number;
}

// Store state types
export interface GridState {
  gridSize: number;
  tileSize: number;
  selectedTiles: string[];
  hoveredTile: string | null;
  grid: Tile[];
}

export interface BuildingState {
  buildings: Record<string, Building>;
  currentBuildingType: string | null;
  buildMode: BuildMode;
}

export interface ResourceState {
  resources: Record<string, number>;
}

export interface CoreState {
  coreHealth: number;
  coreMaxHealth: number;
}

export interface GameState {
  gameStage: GameStage;
  waveNumber: number;
  enemies: Enemy[];
  playerHealth: number;
}

// Combine all state types into one root state
export interface RootState extends GridState, BuildingState, ResourceState, CoreState, GameState {
  // Additional root-level state can go here if needed
}