import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import GameButton from '../components/GameButton';
import { PLAYER_COLORS } from '../game/constants';

const { width, height } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const logoScaleAnim = useRef(new Animated.Value(0)).current;
  const boardRotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.sequence([
      Animated.timing(logoScaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(boardRotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous subtle rotation for board
    const rotationAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(boardRotateAnim, {
          toValue: 1.1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(boardRotateAnim, {
          toValue: 0.9,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    rotationAnimation.start();

    return () => rotationAnimation.stop();
  }, [logoScaleAnim, boardRotateAnim, fadeAnim]);

  const rotate = boardRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScaleAnim }],
            },
          ]}
        >
          <Text style={styles.logoText}>LUDO</Text>
          <Text style={styles.subtitleText}>Classic Board Game</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.boardPreview,
            {
              transform: [{ rotate }],
            },
          ]}
        >
          <View style={styles.miniBoard}>
            <View style={[styles.quadrant, { backgroundColor: PLAYER_COLORS.RED }]} />
            <View style={[styles.quadrant, { backgroundColor: PLAYER_COLORS.GREEN }]} />
            <View style={[styles.quadrant, { backgroundColor: PLAYER_COLORS.YELLOW }]} />
            <View style={[styles.quadrant, { backgroundColor: PLAYER_COLORS.BLUE }]} />
            <View style={styles.center} />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <GameButton
            title="2 Players"
            onPress={() => navigation.navigate('Game', { gameMode: 2 })}
            variant="primary"
            icon="👥"
          />
          <GameButton
            title="4 Players"
            onPress={() => navigation.navigate('Game', { gameMode: 4 })}
            variant="secondary"
            icon="🎮"
          />
          <GameButton
            title="How to Play"
            onPress={() => navigation.navigate('HowToPlay')}
            variant="secondary"
            icon="❓"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.settingsButton,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <GameButton
            title="⚙️ Settings"
            onPress={() => navigation.navigate('Settings')}
            variant="secondary"
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 12,
    letterSpacing: 6,
  },
  subtitleText: {
    fontSize: 20,
    color: '#a0a0a0',
    marginTop: 12,
    letterSpacing: 3,
    fontWeight: '500',
  },
  boardPreview: {
    marginVertical: 40,
  },
  miniBoard: {
    width: width * 0.65,
    height: width * 0.65,
    backgroundColor: '#fff',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 15,
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 3,
    borderColor: '#333',
  },
  quadrant: {
    width: '45%',
    height: '45%',
    margin: '2.5%',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  center: {
    position: 'absolute',
    width: width * 0.22,
    height: width * 0.22,
    backgroundColor: '#fff',
    borderRadius: 15,
    top: '50%',
    left: '50%',
    marginTop: -width * 0.11,
    marginLeft: -width * 0.11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#333',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  settingsButton: {
    marginTop: 25,
    width: width * 0.55,
  },
});

export default HomeScreen;
