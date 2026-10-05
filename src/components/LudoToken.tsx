import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { PLAYER_COLORS, TokenState } from '../game/constants';
import { Token } from '../game/gameLogic';

const { width } = Dimensions.get('window');
const TOKEN_SIZE = width * 0.05;

interface LudoTokenProps {
  token: Token;
  onPress: () => void;
  isPlayable?: boolean;
  isCurrentPlayer?: boolean;
}

const LudoToken: React.FC<LudoTokenProps> = ({
  token,
  onPress,
  isPlayable = false,
  isCurrentPlayer = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPlayable && isCurrentPlayer) {
      // Pulse animation for playable tokens
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => pulseAnimation.stop();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isPlayable, isCurrentPlayer, scaleAnim]);

  const handlePress = () => {
    if (isPlayable) {
      // Bounce animation on press
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      onPress();
    }
  };

  const tokenColor = PLAYER_COLORS[token.player];
  const isFinished = token.state === TokenState.FINISHED;
  const isInBase = token.state === TokenState.IN_BASE;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.token,
          {
            backgroundColor: isFinished ? '#FFD700' : tokenColor,
            transform: [
              { scale: scaleAnim },
              { translateY: bounceAnim },
            ],
            opacity: isInBase && !isPlayable ? 0.6 : 1,
          },
        ]}
      >
        <View style={styles.innerCircle} />
        {isFinished && (
          <View style={styles.star}>★</View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: TOKEN_SIZE,
    height: TOKEN_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  token: {
    width: TOKEN_SIZE * 0.9,
    height: TOKEN_SIZE * 0.9,
    borderRadius: TOKEN_SIZE * 0.45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  innerCircle: {
    width: TOKEN_SIZE * 0.5,
    height: TOKEN_SIZE * 0.5,
    borderRadius: TOKEN_SIZE * 0.25,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  star: {
    position: 'absolute',
    fontSize: TOKEN_SIZE * 0.5,
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default LudoToken;
