import '../global.css';
import { Stack } from 'expo-router';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="story/[seasonId]" />
      </Stack>
      {Platform.OS === 'web' && <View className="noise-overlay" />}
    </GestureHandlerRootView>
  );
}
