import { Player } from './constants';

// Main path coordinates (15x15 board)
// Each cell is represented as [row, col]
// Complete circular path with 52 cells
export const MAIN_PATH: [number, number][] = [
  // Starting from Red's position (6,1) going clockwise
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],  // Red's starting area (5 cells)
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],  // Going up left side (6 cells)
  [0, 7], [0, 8],  // Top middle (2 cells)
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],  // Going down right side of top (5 cells)
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],  // Going right on top (6 cells)
  [7, 14], [8, 14],  // Right middle (2 cells)
  [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],  // Going left on right side (5 cells)
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],  // Going down right side (6 cells)
  [14, 7], [14, 6],  // Bottom middle (2 cells)
  [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],  // Going up left side of bottom (5 cells)
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1],  // Going left on bottom (6 cells)
  [7, 0], [6, 0],  // Left middle (2 cells)
];

// Home paths for each player (6 cells including final center position)
export const HOME_PATHS: Record<Player, [number, number][]> = {
  RED: [
    [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6]  // Red's home path (left to center)
  ],
  GREEN: [
    [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]  // Green's home path (top to center)
  ],
  YELLOW: [
    [7, 13], [7, 12], [7, 11], [7, 10], [7, 9], [7, 8]  // Yellow's home path (right to center)
  ],
  BLUE: [
    [13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]  // Blue's home path (bottom to center)
  ],
};

// Base positions for each player's tokens
export const BASE_POSITIONS: Record<Player, [number, number][]> = {
  RED: [
    [1, 1], [1, 4], [4, 1], [4, 4]
  ],
  GREEN: [
    [1, 10], [1, 13], [4, 10], [4, 13]
  ],
  YELLOW: [
    [10, 10], [10, 13], [13, 10], [13, 13]
  ],
  BLUE: [
    [10, 1], [10, 4], [13, 1], [13, 4]
  ],
};

// Get the position index on the main path for a given player
export function getMainPathIndex(player: Player, steps: number): number {
  const startPositions: Record<Player, number> = {
    RED: 0,
    GREEN: 13,
    YELLOW: 26,
    BLUE: 39,
  };
  
  const startIndex = startPositions[player];
  return (startIndex + steps) % MAIN_PATH.length;
}

// Get the home path index for a player
export function getHomePathIndex(player: Player, steps: number): number {
  return steps;
}

// Check if a position is a safe cell
// Safe cells are at positions 0, 8, 13, 21, 26, 34, 39, 47 on the main path
export function isSafeCell(position: number): boolean {
  const safeCells = [0, 8, 13, 21, 26, 34, 39, 47];
  return safeCells.includes(position);
}
