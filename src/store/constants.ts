// src/store/constants.ts
import { BuildingProperties, TileProperties } from './types';

// Building types and their properties
export const BUILDING_TYPES: Record<string, BuildingProperties> = {
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
export const TILE_TYPES: Record<string, TileProperties> = {
  GRASS: { buildable: true, walkable: true },
  WATER: { buildable: false, walkable: false },
  STONE: { buildable: true, walkable: true, resource: 'stone' },
  TREE: { buildable: true, walkable: true, resource: 'wood' }
};

// Initial resources
export const INITIAL_RESOURCES: Record<string, number> = {
  gold: 500,
  wood: 200,
  stone: 200
};

// Core structure constants
export const CORE_MAX_HEALTH = 1000;

// Grid size constants
export const DEFAULT_GRID_SIZE = 50;
export const DEFAULT_TILE_SIZE = 1;