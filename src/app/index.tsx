import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  Easing 
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

export default function SplashScreen() {
  const router = useRouter();
  
  // Animation Values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const letterSpacing = useSharedValue(10);
  
  useEffect(() => {
    // Cinematic fade and scale in
    opacity.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.exp) });
    scale.value = withSpring(1, { damping: 20, stiffness: 90 });
    letterSpacing.value = withTiming(2, { duration: 2000, easing: Easing.out(Easing.cubic) });
    
    // Auto-navigate to home after 3 seconds
    const timer = setTimeout(() => {
      // Fade out before navigating
      opacity.value = withTiming(0, { duration: 500 });
      scale.value = withTiming(1.1, { duration: 500 });
      
      setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 500);
      
    }, 2500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
    letterSpacing: letterSpacing.value,
  }));

  return (
    <View className="flex-1 bg-black justify-center items-center">
      <StatusBar style="light" />
      
      <Animated.Text 
        className="text-white font-black text-6xl uppercase tracking-widest"
        style={[styles.glowText, animatedTextStyle]}
      >
        LUMINA
      </Animated.Text>
      
      <Animated.Text 
        className="text-zinc-500 font-bold uppercase tracking-[8px] text-xs mt-6"
        style={{ opacity: opacity }}
      >
        Immersive Fiction
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  glowText: {
    textShadowColor: 'rgba(255,255,255,0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  }
});
