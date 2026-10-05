import {
  Player,
  TOKENS_PER_PLAYER,
  START_POSITIONS,
  HOME_ENTRY_POSITIONS,
  TokenState,
  DiceValue,
} from './constants';
import { MAIN_PATH, HOME_PATHS, isSafeCell } from './boardPath';

export interface Token {
  id: number;
  player: Player;
  state: TokenState;
  position: number; // Position on path (0-51 for main path, 0-5 for home path)
  stepsTaken: number; // Total steps taken from base
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  tokens: Record<Player, Token[]>;
  diceValue: DiceValue | null;
  isRolling: boolean;
  winner: Player | null;
  gameMode: 2 | 4;
}

// Initialize game state
export function initializeGame(gameMode: 2 | 4): GameState {
  const players: Player[] = gameMode === 2 
    ? ['RED', 'GREEN'] 
    : ['RED', 'GREEN', 'YELLOW', 'BLUE'];

  const tokens: Record<Player, Token[]> = {} as Record<Player, Token[]>;
  
  players.forEach(player => {
    tokens[player] = Array.from({ length: TOKENS_PER_PLAYER }, (_, i) => ({
      id: i,
      player,
      state: TokenState.IN_BASE,
      position: -1,
      stepsTaken: 0,
    }));
  });

  return {
    players,
    currentPlayerIndex: 0,
    tokens,
    diceValue: null,
    isRolling: false,
    winner: null,
    gameMode,
  };
}

// Roll dice
export function rollDice(): DiceValue {
  return Math.floor(Math.random() * 6) + 1 as DiceValue;
}

// Check if a token can move
export function canTokenMove(token: Token, diceValue: DiceValue): boolean {
  // Token in base - needs 6 to come out
  if (token.state === TokenState.IN_BASE) {
    return diceValue === 6;
  }

  // Token finished - cannot move
  if (token.state === TokenState.FINISHED) {
    return false;
  }

  // Token on board or in home
  const totalStepsNeeded = 56; // 51 on main path + 5 in home path
  const newSteps = token.stepsTaken + diceValue;

  // Check if token would exceed final position
  if (newSteps > totalStepsNeeded) {
    return false;
  }

  return true;
}

// Get valid moves for a player
export function getValidMoves(gameState: GameState, diceValue: DiceValue): number[] {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const playerTokens = gameState.tokens[currentPlayer];
  
  return playerTokens
    .map((token, index) => (canTokenMove(token, diceValue) ? index : -1))
    .filter(index => index !== -1);
}

// Move a token
export function moveToken(
  gameState: GameState,
  tokenIndex: number,
  diceValue: DiceValue
): GameState {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const token = { ...gameState.tokens[currentPlayer][tokenIndex] };

  // Token in base - move to starting position
  if (token.state === TokenState.IN_BASE) {
    token.state = TokenState.ON_BOARD;
    token.position = START_POSITIONS[currentPlayer];
    token.stepsTaken = 0;
  } else {
    // Token on board or in home - move forward
    token.stepsTaken += diceValue;

    // Check if token enters home path (after 50 steps on main path)
    const stepsToHomeEntry = 50;
    if (token.stepsTaken > stepsToHomeEntry) {
      token.state = TokenState.IN_HOME;
      const homeSteps = token.stepsTaken - stepsToHomeEntry - 1;
      token.position = homeSteps;
      
      // Check if token reached finish (position 5 in home path is center)
      if (homeSteps === 5) {
        token.state = TokenState.FINISHED;
      }
    } else {
      // Update position on main path - calculate from starting position
      const startPos = START_POSITIONS[currentPlayer];
      token.position = (startPos + token.stepsTaken) % MAIN_PATH.length;
    }
  }

  // Update tokens
  const newTokens = { ...gameState.tokens };
  newTokens[currentPlayer] = [...gameState.tokens[currentPlayer]];
  newTokens[currentPlayer][tokenIndex] = token;

  // Check for captures (only on main path, not in home, and not on safe cells)
  let capturedToken: { player: Player; tokenIndex: number } | null = null;
  if (token.state === TokenState.ON_BOARD && !isSafeCell(token.position)) {
    gameState.players.forEach(player => {
      if (player !== currentPlayer) {
        newTokens[player].forEach((opponentToken, idx) => {
          if (
            opponentToken.state === TokenState.ON_BOARD &&
            opponentToken.position === token.position
          ) {
            // Capture!
            newTokens[player][idx] = {
              ...opponentToken,
              state: TokenState.IN_BASE,
              position: -1,
              stepsTaken: 0,
            };
            capturedToken = { player, tokenIndex: idx };
          }
        });
      }
    });
  }

  // Check for winner
  const winner = checkWinner(newTokens, currentPlayer);

  // Update current player (if no 6 was rolled and no winner)
  let nextPlayerIndex = gameState.currentPlayerIndex;
  if (diceValue !== 6 && !winner) {
    nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
  }

  return {
    ...gameState,
    tokens: newTokens,
    currentPlayerIndex: nextPlayerIndex,
    diceValue,
    winner,
  };
}

// Check if a player has won
export function checkWinner(tokens: Record<Player, Token[]>, player: Player): Player | null {
  const playerTokens = tokens[player];
  const allFinished = playerTokens.every(token => token.state === TokenState.FINISHED);
  return allFinished ? player : null;
}

// Check if player has any valid moves
export function hasValidMoves(gameState: GameState, diceValue: DiceValue): boolean {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const playerTokens = gameState.tokens[currentPlayer];
  
  return playerTokens.some(token => canTokenMove(token, diceValue));
}

// Auto-advance to next player if no valid moves
export function autoAdvancePlayer(gameState: GameState, diceValue: DiceValue): GameState {
  if (hasValidMoves(gameState, diceValue)) {
    return gameState;
  }

  const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
  return {
    ...gameState,
    currentPlayerIndex: nextPlayerIndex,
    diceValue: null, // Reset dice for next player
  };
}

// Get token display position (for rendering)
export function getTokenDisplayPosition(token: Token): [number, number] {
  if (token.state === TokenState.IN_BASE) {
    // Will be handled by base positioning
    return [0, 0];
  }

  if (token.state === TokenState.FINISHED) {
    // Center of board
    return [7, 7];
  }

  if (token.state === TokenState.IN_HOME) {
    return HOME_PATHS[token.player][token.position];
  }

  // On main path
  return MAIN_PATH[token.position];
}
