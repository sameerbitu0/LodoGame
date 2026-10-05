import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface GameButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: string;
}

const GameButton: React.FC<GameButtonProps> = ({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  icon,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'danger':
        return styles.dangerButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'danger':
        return styles.dangerText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.9}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.button,
          getButtonStyle(),
          {
            transform: [{ scale: scaleAnim }],
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={[styles.text, getTextStyle()]}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.7,
    alignSelf: 'center',
    marginVertical: 8,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#45a049',
  },
  secondaryButton: {
    backgroundColor: '#2196F3',
    borderWidth: 2,
    borderColor: '#1976D2',
  },
  dangerButton: {
    backgroundColor: '#f44336',
    borderWidth: 2,
    borderColor: '#d32f2f',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
  dangerText: {
    color: '#fff',
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
});

export default GameButton;
