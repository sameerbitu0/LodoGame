import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { PLAYER_COLORS, DICE_ROLL_DURATION } from '../game/constants';
import { DiceValue } from '../game/constants';

const { width } = Dimensions.get('window');
const DICE_SIZE = width * 0.15;

interface DiceProps {
  value: DiceValue | null;
  isRolling: boolean;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
}

const Dice: React.FC<DiceProps> = ({
  value,
  isRolling,
  onPress,
  disabled = false,
  color = PLAYER_COLORS.RED,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRolling) {
      // Start rolling animation
      const rotateAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ])
      );

      const scaleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ])
      );

      rotateAnimation.start();
      scaleAnimation.start();

      // Stop after duration
      const timeout = setTimeout(() => {
        rotateAnimation.stop();
        scaleAnimation.stop();
        rotateAnim.setValue(0);
        scaleAnim.setValue(1);
      }, DICE_ROLL_DURATION);

      return () => {
        rotateAnimation.stop();
        scaleAnimation.stop();
        clearTimeout(timeout);
      };
    }
  }, [isRolling, rotateAnim, scaleAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderDots = (diceValue: DiceValue) => {
    const dotSize = DICE_SIZE * 0.15;
    const dotStyle = {
      width: dotSize,
      height: dotSize,
      borderRadius: dotSize / 2,
      backgroundColor: '#000',
    };

    const positions: Record<DiceValue, Array<{ top: string; left: string }>> = {
      1: [{ top: '40%', left: '40%' }],
      2: [
        { top: '20%', left: '20%' },
        { top: '60%', left: '60%' },
      ],
      3: [
        { top: '20%', left: '20%' },
        { top: '40%', left: '40%' },
        { top: '60%', left: '60%' },
      ],
      4: [
        { top: '20%', left: '20%' },
        { top: '20%', left: '60%' },
        { top: '60%', left: '20%' },
        { top: '60%', left: '60%' },
      ],
      5: [
        { top: '20%', left: '20%' },
        { top: '20%', left: '60%' },
        { top: '40%', left: '40%' },
        { top: '60%', left: '20%' },
        { top: '60%', left: '60%' },
      ],
      6: [
        { top: '20%', left: '20%' },
        { top: '20%', left: '60%' },
        { top: '40%', left: '20%' },
        { top: '40%', left: '60%' },
        { top: '60%', left: '20%' },
        { top: '60%', left: '60%' },
      ],
    };

    return positions[diceValue].map((pos, index) => (
      <View key={index} style={[styles.dot, dotStyle, pos]} />
    ));
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isRolling}
      activeOpacity={0.8}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.dice,
          {
            transform: [{ rotate: rotate }, { scale: scaleAnim }],
            backgroundColor: disabled ? '#ccc' : '#fff',
          },
        ]}
      >
        {value !== null && renderDots(value)}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dice: {
    width: DICE_SIZE,
    height: DICE_SIZE,
    borderRadius: DICE_SIZE * 0.15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  dot: {
    position: 'absolute',
  },
});

export default Dice;
