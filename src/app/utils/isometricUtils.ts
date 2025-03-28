// src/app/utils/isometricUtils.ts

/**
 * Constants for isometric calculations
 */
export const ISOMETRIC_ANGLE = Math.PI / 4; // 45 degrees in radians
export const DEFAULT_TILE_SIZE = 1;

/**
 * Types for the grid system
 */
export interface Tile {
  id: string;
  position: [number, number];
  type: string;
  properties: TileProperties;
}

export interface TileProperties {
  buildable: boolean;
  walkable: boolean;
  resource?: string;
}

export interface Building {
  id: string;
  type: string;
  tileId: string;
  health: number;
  properties: BuildingProperties;
}

export interface BuildingProperties {
  id: string;
  name: string;
  cost: Record<string, number>;
  health: number;
  size: [number, number];
  model: string;
  damage?: number;
  range?: number;
  attackSpeed?: number;
  generates?: Record<string, number>;
}

/**
 * Converts grid (cartesian) coordinates to isometric screen coordinates
 * @param {number} x - Grid x position
 * @param {number} z - Grid z position
 * @param {number} tileSize - Size of each tile (default: 1)
 * @returns {[number, number]} [isoX, isoZ] coordinates
 */
export function cartesianToIsometric(
  x: number, 
  z: number, 
  tileSize: number = DEFAULT_TILE_SIZE
): [number, number] {
  return [
    (x - z) * Math.cos(ISOMETRIC_ANGLE) * tileSize,
    (x + z) * Math.sin(ISOMETRIC_ANGLE) * tileSize
  ];
}

/**
 * Converts isometric screen coordinates back to grid (cartesian) coordinates
 * @param {number} isoX - Isometric x position
 * @param {number} isoZ - Isometric z position
 * @param {number} tileSize - Size of each tile (default: 1)
 * @returns {[number, number]} [x, z] grid coordinates
 */
export function isometricToCartesian(
  isoX: number, 
  isoZ: number, 
  tileSize: number = DEFAULT_TILE_SIZE
): [number, number] {
  const normalizedIsoX = isoX / tileSize;
  const normalizedIsoZ = isoZ / tileSize;
  
  // Inverse of the isometric transformation
  const x = (normalizedIsoX / Math.cos(ISOMETRIC_ANGLE) + normalizedIsoZ / Math.sin(ISOMETRIC_ANGLE)) / 2;
  const z = (normalizedIsoZ / Math.sin(ISOMETRIC_ANGLE) - normalizedIsoX / Math.cos(ISOMETRIC_ANGLE)) / 2;
  
  return [Math.round(x), Math.round(z)];
}

/**
 * Determines if a tile is valid for building placement
 * @param {Tile | undefined} tile - Tile object
 * @param {Record<string, Building>} buildings - Current buildings object
 * @returns {boolean} Whether the tile is valid for building
 */
export function isTileValidForBuilding(
  tile: Tile | undefined, 
  buildings: Record<string, Building>
): boolean {
  // Check if tile exists
  if (!tile) return false;
  
  // Check if tile is buildable
  if (!tile.properties?.buildable) return false;
  
  // Check if tile is already occupied
  if (buildings[tile.id]) return false;
  
  return true;
}

/**
 * Gets neighbor tiles in the four cardinal directions
 * @param {Tile[]} grid - The grid array
 * @param {string} tileId - The center tile ID
 * @returns {Tile[]} Array of neighboring tile objects
 */
export function getNeighborTiles(grid: Tile[], tileId: string): Tile[] {
  const tile = grid.find(t => t.id === tileId);
  if (!tile) return [];
  
  const [x, z] = tile.position;
  const neighborPositions: [number, number][] = [
    [x + 1, z], // East
    [x - 1, z], // West
    [x, z + 1], // South
    [x, z - 1]  // North
  ];
  
  return grid.filter(t => 
    neighborPositions.some(([nx, nz]) => 
      t.position[0] === nx && t.position[1] === nz
    )
  );
}