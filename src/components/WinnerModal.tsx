import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Animated,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { PLAYER_COLORS, PLAYER_NAMES } from '../game/constants';
import { Player } from '../game/constants';
import GameButton from './GameButton';

const { width, height } = Dimensions.get('window');

interface WinnerModalProps {
  visible: boolean;
  winner: Player;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({
  visible,
  winner,
  onPlayAgain,
  onBackToHome,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Entrance animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous bounce animation for trophy
      const bounceAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      bounceAnimation.start();

      return () => bounceAnimation.stop();
    } else {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      bounceAnim.setValue(0);
    }
  }, [visible, scaleAnim, rotateAnim, bounceAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '10deg'],
  });

  const winnerColor = PLAYER_COLORS[winner];
  const winnerName = PLAYER_NAMES[winner];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.trophyContainer,
              {
                transform: [{ rotate: rotate }, { translateY: bounceAnim }],
              },
            ]}
          >
            <Text style={styles.trophy}>🏆</Text>
          </Animated.View>

          <Text style={styles.winnerText}>Winner!</Text>
          <Text style={[styles.winnerName, { color: winnerColor }]}>
            {winnerName}
          </Text>

          <View style={styles.buttonContainer}>
            <GameButton
              title="Play Again"
              onPress={onPlayAgain}
              variant="primary"
            />
            <GameButton
              title="Back to Home"
              onPress={onBackToHome}
              variant="secondary"
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  trophyContainer: {
    marginBottom: 20,
  },
  trophy: {
    fontSize: 80,
  },
  winnerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  winnerName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
  },
});

export default WinnerModal;
