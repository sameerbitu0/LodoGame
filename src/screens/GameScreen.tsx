import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { GameState, initializeGame, rollDice, moveToken, autoAdvancePlayer, getValidMoves } from '../game/gameLogic';
import { PLAYER_COLORS, PLAYER_NAMES, START_POSITIONS, TokenState } from '../game/constants';
import { MAIN_PATH, HOME_PATHS, BASE_POSITIONS, isSafeCell } from '../game/boardPath';
import Dice from '../components/Dice';
import LudoToken from '../components/LudoToken';
import WinnerModal from '../components/WinnerModal';
import GameButton from '../components/GameButton';

const { width, height } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width, height - 200) * 0.95;
const CELL_SIZE = BOARD_SIZE / 15;

type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;
type GameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Game'>;

const GameScreen: React.FC = () => {
  const route = useRoute<GameScreenRouteProp>();
  const navigation = useNavigation<GameScreenNavigationProp>();
  const { gameMode } = route.params;
  const [gameState, setGameState] = useState<GameState>(() => ({
    ...initializeGame(gameMode),
    gameMode,
  }));
  const [selectedToken, setSelectedToken] = useState<{ player: string; index: number } | null>(null);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const currentPlayerColor = PLAYER_COLORS[currentPlayer];

  const handleRollDice = useCallback(() => {
    if (gameState.isRolling || gameState.diceValue !== null) return;

    setGameState(prev => ({ ...prev, isRolling: true }));

    setTimeout(() => {
      const diceValue = rollDice();
      setGameState(prev => {
        const newState = { ...prev, diceValue, isRolling: false };
        
        // Check if player has valid moves
        const validMoves = getValidMoves(newState, diceValue);
        if (validMoves.length === 0) {
          // Auto-advance to next player
          return autoAdvancePlayer(newState, diceValue);
        }
        
        return newState;
      });
    }, 1000);
  }, [gameState.isRolling, gameState.diceValue]);

  const handleTokenPress = useCallback((player: string, tokenIndex: number) => {
    if (gameState.diceValue === null || gameState.isRolling) return;
    if (player !== currentPlayer) return;

    const validMoves = getValidMoves(gameState, gameState.diceValue);
    if (!validMoves.includes(tokenIndex)) return;

    // Move the token
    const newState = moveToken(gameState, tokenIndex, gameState.diceValue);
    setGameState(newState);
    setSelectedToken(null);
  }, [gameState, currentPlayer]);

  const handlePlayAgain = useCallback(() => {
    setGameState(initializeGame(gameMode));
  }, [gameMode]);

  const renderBoard = () => {
    const cells: React.ReactNode[] = [];

    // Render all 15x15 cells
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        const cellType = getCellType(row, col);
        const cellColor = getCellColor(row, col, cellType);
        const isSafe = isMainPathCell(row, col) && isSafeCell(getMainPathIndex(row, col));

        cells.push(
          <View
            key={`${row}-${col}`}
            style={[
              styles.cell,
              {
                left: col * CELL_SIZE,
                top: row * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: cellColor,
                borderWidth: isSafe ? 2 : 1,
                borderColor: isSafe ? '#FFD700' : 'rgba(0,0,0,0.1)',
              },
            ]}
          >
            {isSafe && <Text style={styles.safeMarker}>★</Text>}
          </View>
        );
      }
    }

    // Render tokens
    gameState.players.forEach(player => {
      gameState.tokens[player as keyof typeof gameState.tokens].forEach((token: any, index: number) => {
        const position = getTokenPosition(token);
        if (position) {
          const isPlayable = 
            player === currentPlayer && 
            gameState.diceValue !== null &&
            getValidMoves(gameState, gameState.diceValue).includes(index);

          cells.push(
            <View
              key={`token-${player}-${index}`}
              style={[
                styles.tokenContainer,
                {
                  left: position.col * CELL_SIZE + CELL_SIZE / 2,
                  top: position.row * CELL_SIZE + CELL_SIZE / 2,
                },
              ]}
            >
              <LudoToken
                token={token}
                onPress={() => handleTokenPress(player, index)}
                isPlayable={isPlayable}
                isCurrentPlayer={player === currentPlayer}
              />
            </View>
          );
        }
      });
    });

    return cells;
  };

  const getCellType = (row: number, col: number): string => {
    // Base areas
    if (row >= 1 && row <= 4 && col >= 1 && col <= 4) return 'BASE_RED';
    if (row >= 1 && row <= 4 && col >= 10 && col <= 13) return 'BASE_GREEN';
    if (row >= 10 && row <= 13 && col >= 10 && col <= 13) return 'BASE_YELLOW';
    if (row >= 10 && row <= 13 && col >= 1 && col <= 4) return 'BASE_BLUE';

    // Home paths
    if (row === 7 && col >= 1 && col <= 5) return 'HOME_RED';
    if (col === 7 && row >= 1 && row <= 5) return 'HOME_GREEN';
    if (row === 7 && col >= 9 && col <= 13) return 'HOME_YELLOW';
    if (col === 7 && row >= 9 && row <= 13) return 'HOME_BLUE';

    // Center
    if (row >= 6 && row <= 8 && col >= 6 && col <= 8) return 'CENTER';

    // Main path
    return 'PATH';
  };

  const getCellColor = (row: number, col: number, cellType: string): string => {
    switch (cellType) {
      case 'BASE_RED':
        return '#FFCDD2';
      case 'BASE_GREEN':
        return '#C8E6C9';
      case 'BASE_YELLOW':
        return '#FFF9C4';
      case 'BASE_BLUE':
        return '#BBDEFB';
      case 'HOME_RED':
        return PLAYER_COLORS.RED;
      case 'HOME_GREEN':
        return PLAYER_COLORS.GREEN;
      case 'HOME_YELLOW':
        return PLAYER_COLORS.YELLOW;
      case 'HOME_BLUE':
        return PLAYER_COLORS.BLUE;
      case 'CENTER':
        return '#fff';
      case 'PATH':
        return '#f5f5f5';
      default:
        return '#fff';
    }
  };

  const isMainPathCell = (row: number, col: number): boolean => {
    return MAIN_PATH.some(([r, c]) => r === row && c === col);
  };

  const getMainPathIndex = (row: number, col: number): number => {
    return MAIN_PATH.findIndex(([r, c]) => r === row && c === col);
  };

  const getTokenPosition = (token: any) => {
    if (token.state === TokenState.IN_BASE) {
      const basePositions = BASE_POSITIONS[token.player as keyof typeof BASE_POSITIONS];
      return { row: basePositions[token.id][0], col: basePositions[token.id][1] };
    }

    if (token.state === TokenState.FINISHED) {
      return { row: 7, col: 7 };
    }

    if (token.state === TokenState.IN_HOME) {
      const homePath = HOME_PATHS[token.player as keyof typeof HOME_PATHS];
      return { row: homePath[token.position][0], col: homePath[token.position][1] };
    }

    // On main path
    const [row, col] = MAIN_PATH[token.position];
    return { row, col };
  };

  const getCompletedTokens = (player: string): number => {
    return gameState.tokens[player as keyof typeof gameState.tokens].filter((t: any) => t.state === TokenState.FINISHED).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Player Info */}
      <View style={styles.playerInfo}>
        <View style={styles.playerHeader}>
          <View style={[styles.playerIndicator, { backgroundColor: currentPlayerColor }]} />
          <Text style={styles.playerText}>
            {PLAYER_NAMES[currentPlayer]}'s Turn
          </Text>
        </View>
        {gameState.diceValue !== null && (
          <Text style={styles.diceResult}>🎲 {gameState.diceValue}</Text>
        )}
      </View>

      {/* Game Board */}
      <View style={styles.boardContainer}>
        <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
          {renderBoard()}
        </View>
      </View>

      {/* Dice and Controls */}
      <View style={styles.controls}>
        <Dice
          value={gameState.diceValue}
          isRolling={gameState.isRolling}
          onPress={handleRollDice}
          disabled={gameState.diceValue !== null}
          color={currentPlayerColor}
        />
        
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Player Stats */}
      <View style={styles.stats}>
        {gameState.players.map(player => (
          <View key={player} style={styles.statItem}>
            <View style={[styles.statIndicator, { backgroundColor: PLAYER_COLORS[player] }]} />
            <Text style={styles.statText}>
              {getCompletedTokens(player)}/4
            </Text>
          </View>
        ))}
      </View>

      {/* Winner Modal */}
      <WinnerModal
        visible={gameState.winner !== null}
        winner={gameState.winner!}
        onPlayAgain={handlePlayAgain}
        onBackToHome={() => navigation.navigate('Home')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  playerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  playerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  diceResult: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  board: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
  },
  cell: {
    position: 'absolute',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  safeMarker: {
    position: 'absolute',
    fontSize: 12,
    color: '#FFD700',
    top: '50%',
    left: '50%',
    marginTop: -6,
    marginLeft: -6,
  },
  tokenContainer: {
    position: 'absolute',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#e94560',
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIndicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 8,
  },
  statText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default GameScreen;
