import AsyncStorage from '@react-native-async-storage/async-storage';

// Settings storage keys
const SETTINGS_KEY = '@ludo_settings';

export interface Settings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  musicEnabled: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  vibrationEnabled: true,
  musicEnabled: true,
};

// Load settings from AsyncStorage
export async function loadSettings(): Promise<Settings> {
  try {
    const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
    if (settingsJson) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(settingsJson) };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

// Save settings to AsyncStorage
export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

// Haptic feedback wrapper
export function triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' = 'medium') {
  // Haptic feedback would require additional library
  // Placeholder for future implementation
  console.log('Haptic feedback:', type);
}

// Scale animation value for responsive design
export function scaleValue(value: number, scaleFactor: number): number {
  return value * scaleFactor;
}

// Generate random delay for animation variety
export function randomDelay(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
