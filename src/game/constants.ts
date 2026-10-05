// Player colors and configuration
export const PLAYER_COLORS = {
  RED: '#E53935',
  GREEN: '#43A047',
  YELLOW: '#FDD835',
  BLUE: '#1E88E5',
};

export const PLAYER_NAMES = {
  RED: 'Player 1',
  GREEN: 'Player 2',
  YELLOW: 'Player 3',
  BLUE: 'Player 4',
};

export const PLAYERS = ['RED', 'GREEN', 'YELLOW', 'BLUE'] as const;
export type Player = typeof PLAYERS[number];

// Board configuration
export const BOARD_SIZE = 15;
export const CELL_SIZE = 24;
export const TOKENS_PER_PLAYER = 4;

// Dice configuration
export const DICE_VALUES = [1, 2, 3, 4, 5, 6] as const;
export type DiceValue = typeof DICE_VALUES[number];

// Game states
export const GAME_MODES = {
  TWO_PLAYERS: 2,
  FOUR_PLAYERS: 4,
} as const;
export type GameMode = typeof GAME_MODES[keyof typeof GAME_MODES];

// Safe cells (where tokens cannot be captured) - based on main path indices
export const SAFE_CELLS = [0, 8, 13, 21, 26, 34, 39, 47];

// Starting positions for each player on the main path
export const START_POSITIONS: Record<Player, number> = {
  RED: 0,
  GREEN: 13,
  YELLOW: 26,
  BLUE: 39,
};

// Home entry positions (where player enters their home stretch)
export const HOME_ENTRY_POSITIONS: Record<Player, number> = {
  RED: 50,
  GREEN: 11,
  YELLOW: 24,
  BLUE: 37,
};

// Token states
export enum TokenState {
  IN_BASE = 'IN_BASE',
  ON_BOARD = 'ON_BOARD',
  IN_HOME = 'IN_HOME',
  FINISHED = 'FINISHED',
}

// Animation durations
export const ANIMATION_DURATION = 300;
export const DICE_ROLL_DURATION = 1000;
export const TOKEN_MOVE_DURATION = 200;
