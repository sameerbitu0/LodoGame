import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import GameScreen from '../screens/GameScreen';
import HowToPlayScreen from '../screens/HowToPlayScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
  Home: undefined;
  Game: { gameMode: 2 | 4 };
  HowToPlay: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
