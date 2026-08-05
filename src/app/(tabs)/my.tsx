import React, { useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { Settings, Bookmark, History, Heart, ChevronRight, Crown, Flame, Award, BookOpen, Clock, Zap } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing, interpolate } from 'react-native-reanimated';
import { PressableScale } from '../../components/ui/PressableScale';

const MENU_ITEMS = [
  { icon: Bookmark, label: 'Saved Stories', count: '12' },
  { icon: History, label: 'Reading History', count: '45' },
  { icon: Heart, label: 'Liked Content', count: '8' },
];

const StatBlock = ({ value, label, delay }: { value: string, label: string, delay: number }) => {
  const progress = useSharedValue(0);
  
  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: interpolate(progress.value, [0, 1], [15, 0]) }]
  }));

  return (
    <Animated.View className="items-center flex-1" style={animatedStyle}>
      <Text className="text-white text-2xl font-extrabold mb-1">{value}</Text>
      <Text className="text-zinc-500 font-bold uppercase text-[9px] tracking-widest text-center">{label}</Text>
    </Animated.View>
  );
};

export default function ProfileScreen() {
  const router = useRouter();
  const headerOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value
  }));

  return (
    <View className="flex-1 bg-noir-bg">
      <StatusBar style="light" />
      
      <ScrollView className="flex-1" bounces={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Animated Header Section with Image */}
        <Animated.View className="h-72 relative w-full" style={headerStyle}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop' }} 
            className="w-full h-full"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)', '#000000']}
            style={StyleSheet.absoluteFill}
            locations={[0, 0.4, 1]}
          />
          <View className="absolute top-14 right-6">
            <PressableScale 
              onPress={() => router.push('/settings')}
              className="bg-black/40 p-3 rounded-full backdrop-blur-md border border-white/10"
            >
              <Settings color="white" size={24} />
            </PressableScale>
          </View>
          
          <View className="absolute bottom-6 left-6 right-6">
            <View className="flex-row items-end justify-between">
              <View>
                <Text className="text-white text-4xl font-extrabold tracking-tight mb-2" style={styles.shadowText}>Alex Reader</Text>
                <View className="flex-row items-center">
                  <View className="bg-noir-accent/20 px-2.5 py-1 rounded-sm border border-noir-accent/50 flex-row items-center">
                    <Crown size={12} color="#FBBF24" strokeWidth={3} />
                    <Text className="text-[#FBBF24] font-bold uppercase tracking-widest text-[10px] ml-1.5">Premium Member</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        <View className="px-6 mt-6">
          {/* Animated Statistics */}
          <LinearGradient
            colors={['#1B1B1B', '#111111']}
            className="flex-row border border-zinc-800/80 rounded-2xl p-6 mb-8 justify-between shadow-lg"
          >
            <StatBlock value="15" label="Day Streak" delay={200} />
            <View className="w-[1px] bg-zinc-800 mx-2" />
            <StatBlock value="42" label="Stories Read" delay={400} />
            <View className="w-[1px] bg-zinc-800 mx-2" />
            <StatBlock value="128" label="Hours Spent" delay={600} />
          </LinearGradient>

          {/* Achievements & Level */}
          <Text className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-4">Reading Journey</Text>
          <View className="flex-row gap-4 mb-8">
            <PressableScale className="flex-1 bg-noir-card border border-zinc-800 rounded-2xl p-4 items-center">
              <View className="w-12 h-12 rounded-full bg-noir-primary/20 items-center justify-center mb-3">
                <Flame size={24} color="#F97316" strokeWidth={2.5} />
              </View>
              <Text className="text-white font-bold mb-1">Level 24</Text>
              <Text className="text-zinc-500 text-[10px] uppercase tracking-widest">Master Reader</Text>
            </PressableScale>

            <PressableScale className="flex-1 bg-noir-card border border-zinc-800 rounded-2xl p-4 items-center">
              <View className="w-12 h-12 rounded-full bg-noir-accent/20 items-center justify-center mb-3">
                <Award size={24} color="#D4A017" strokeWidth={2.5} />
              </View>
              <Text className="text-white font-bold mb-1">12 Badges</Text>
              <Text className="text-zinc-500 text-[10px] uppercase tracking-widest">Achievements</Text>
            </PressableScale>
            
            <PressableScale className="flex-1 bg-noir-card border border-zinc-800 rounded-2xl p-4 items-center">
              <View className="w-12 h-12 rounded-full bg-zinc-800 items-center justify-center mb-3">
                <Zap size={24} color="#A1A1AA" strokeWidth={2.5} />
              </View>
              <Text className="text-white font-bold mb-1">Sci-Fi</Text>
              <Text className="text-zinc-500 text-[10px] uppercase tracking-widest">Top Genre</Text>
            </PressableScale>
          </View>

          <Text className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-4">Your Library</Text>
          
          <View className="bg-noir-card border border-zinc-800 rounded-2xl overflow-hidden mb-8">
            {MENU_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <PressableScale 
                  key={index}
                  className={`flex-row items-center justify-between p-5 ${
                    index !== MENU_ITEMS.length - 1 ? 'border-b border-zinc-800/50' : ''
                  }`}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-noir-surface items-center justify-center mr-4">
                      <Icon color="#ffffff" size={20} strokeWidth={2} />
                    </View>
                    <Text className="text-white font-bold text-base">{item.label}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-noir-primary font-bold mr-3">{item.count}</Text>
                    <ChevronRight color="#71717a" size={18} />
                  </View>
                </PressableScale>
              );
            })}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowText: {
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  }
});
