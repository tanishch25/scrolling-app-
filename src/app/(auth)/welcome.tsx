import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PressableScale } from '../../components/ui/PressableScale';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { signInAsGuest } = useAuth();

  const handleGuest = () => {
    signInAsGuest();
    router.replace('/(tabs)/home');
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1618519764620-7403abdbdf9c?q=80&w=800&auto=format&fit=crop' }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)', '#000000']}
        locations={[0.2, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View className="flex-1 justify-end px-8 pb-16">
        <View className="items-center mb-8">
          <Image 
            source={require('../../../assets/images/icon.png')}
            className="w-16 h-16 rounded-xl mb-6 shadow-glow-primary"
          />
          <Text className="text-white text-5xl font-black tracking-tighter mb-2" style={styles.shadowText}>
            INK
          </Text>
          <Text className="text-zinc-400 text-center font-medium text-base px-4 leading-relaxed">
            Premium cinematic storytelling. Discover your next obsession.
          </Text>
        </View>

        <View className="space-y-4">
          <PressableScale 
            onPress={() => router.push('/(auth)/signup')}
            className="w-full rounded-full overflow-hidden"
          >
            <LinearGradient
              colors={['#F97316', '#C2410C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="py-4 items-center justify-center border-t border-[#FF9852]"
            >
              <Text className="text-white font-bold text-base tracking-widest uppercase">Get Started</Text>
            </LinearGradient>
          </PressableScale>

          <PressableScale 
            onPress={() => router.push('/(auth)/login')}
            className="w-full bg-zinc-900/80 py-4 rounded-full items-center justify-center border border-zinc-700 backdrop-blur-md"
          >
            <Text className="text-white font-bold text-base tracking-widest uppercase">Log In</Text>
          </PressableScale>

          <PressableScale onPress={handleGuest} className="py-4 items-center justify-center">
            <Text className="text-zinc-500 font-bold text-sm tracking-widest uppercase">Continue as Guest</Text>
          </PressableScale>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowText: {
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  }
});
