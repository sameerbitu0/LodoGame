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
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    letterSpacing: 4,
  },
  subtitleText: {
    fontSize: 18,
    color: '#a0a0a0',
    marginTop: 10,
    letterSpacing: 2,
  },
  boardPreview: {
    marginVertical: 30,
  },
  miniBoard: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quadrant: {
    width: '45%',
    height: '45%',
    margin: '2.5%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  center: {
    position: 'absolute',
    width: width * 0.2,
    height: width * 0.2,
    backgroundColor: '#fff',
    borderRadius: 10,
    top: '50%',
    left: '50%',
    marginTop: -width * 0.1,
    marginLeft: -width * 0.1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  settingsButton: {
    marginTop: 20,
    width: width * 0.5,
  },
});

export default HomeScreen;
