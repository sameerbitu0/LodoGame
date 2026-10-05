import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import GameButton from '../components/GameButton';

const { width } = Dimensions.get('window');

type HowToPlayScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HowToPlay'>;

const HowToPlayScreen: React.FC = () => {
  const navigation = useNavigation<HowToPlayScreenNavigationProp>();
  const rules = [
    {
      title: '🎲 Roll the Dice',
      description: 'Tap the dice to roll and get a number between 1-6.',
    },
    {
      title: '🚀 Start Your Journey',
      description: 'You need to roll a 6 to bring a token out of your base.',
    },
    {
      title: '👟 Move Tokens',
      description: 'Move your tokens according to the dice number.',
    },
    {
      title: '⚔️ Capture Opponents',
      description: 'Land on an opponent\'s token to send it back to their base.',
    },
    {
      title: '🛡️ Safe Cells',
      description: 'Some cells are safe - tokens cannot be captured there.',
    },
    {
      title: '🔄 Bonus Turn',
      description: 'Rolling a 6 gives you another turn!',
    },
    {
      title: '🏠 Reach Home',
      description: 'Get all 4 tokens to the center to win the game.',
    },
    {
      title: '🏆 Win the Game',
      description: 'First player to finish all tokens wins!',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>How to Play</Text>
        
        {rules.map((rule, index) => (
          <View key={index} style={styles.ruleCard}>
            <Text style={styles.ruleTitle}>{rule.title}</Text>
            <Text style={styles.ruleDescription}>{rule.description}</Text>
          </View>
        ))}

        <View style={styles.buttonContainer}>
          <GameButton
            title="Back"
            onPress={() => navigation.goBack()}
            variant="secondary"
          />
        </View>
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
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  ruleCard: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  ruleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 8,
  },
  ruleDescription: {
    fontSize: 16,
    color: '#ddd',
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default HowToPlayScreen;
