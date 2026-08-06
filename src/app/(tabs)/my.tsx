import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { Settings, Bookmark, History, Heart, ChevronRight, Crown, Flame, Award, BookOpen, Clock, Zap, User } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing, interpolate } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import { PressableScale } from '../../components/ui/PressableScale';

const MENU_ITEMS = [
  { icon: Bookmark, label: 'Watchlist', count: '5' },
  { icon: History, label: 'Watching History', count: '45' },
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
  const { profile, user, isGuest } = useAuth();
  const headerOpacity = useSharedValue(0);
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 1000 });
    
    // Track real streak
    const loadStreak = async () => {
      try {
        const userId = user?.id || 'guest';
        const streakKey = `streak_${userId}`;
        const lastActiveKey = `last_active_${userId}`;
        
        const currentStreakStr = await AsyncStorage.getItem(streakKey);
        const lastActiveStr = await AsyncStorage.getItem(lastActiveKey);
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        
        let currentStreak = currentStreakStr ? parseInt(currentStreakStr) : 1;
        
        if (lastActiveStr) {
          const lastActive = parseInt(lastActiveStr);
          const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            // Consecutive day
            currentStreak += 1;
          } else if (diffDays > 1) {
            // Streak broken
            currentStreak = 1;
          }
        }
        
        setStreak(currentStreak);
        await AsyncStorage.setItem(streakKey, currentStreak.toString());
        await AsyncStorage.setItem(lastActiveKey, today.toString());
        
      } catch (e) {
        console.error("Error loading streak", e);
      }
    };
    
    loadStreak();
  }, [user]);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value
  }));

  return (
    <View className="flex-1 bg-noir-bg">
      <StatusBar style="light" />
      
      <ScrollView className="flex-1" bounces={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Animated Header Section with Image */}
        <Animated.View className="h-72 relative w-full" style={headerStyle}>
          {isGuest ? (
            <View className="w-full h-full bg-zinc-900 items-center justify-center">
              <User size={80} color="#52525b" />
            </View>
          ) : (
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop' }} 
              className="w-full h-full"
            />
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)', '#000000']}
            style={StyleSheet.absoluteFill}
            locations={[0, 0.4, 1]}
          />
          <View className="absolute top-14 right-6">
            <PressableScale 
              onPress={() => router.push('/settings' as any)}
              className="bg-black/40 p-3 rounded-full backdrop-blur-md border border-white/10"
            >
              <Settings color="white" size={24} />
            </PressableScale>
          </View>
          
          <View className="absolute bottom-6 left-6 right-6">
            <View className="flex-row items-end justify-between">
              <View>
                <Text className="text-white text-4xl font-extrabold tracking-tight mb-2" style={styles.shadowText}>
                  {profile?.username || 'Guest User'}
                </Text>
                <View className="flex-row items-center">
                  <View className="bg-noir-accent/20 px-2.5 py-1 rounded-sm border border-noir-accent/50 flex-row items-center">
                    <Crown size={12} color="#FBBF24" strokeWidth={3} />
                    <Text className="text-[#FBBF24] font-bold uppercase tracking-widest text-[10px] ml-1.5">
                      {profile?.role === 'admin' ? 'Admin' : profile?.is_premium ? 'Premium Member' : 'Free Member'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        <View className="px-6 mt-6">
          <View className="rounded-2xl mb-8 shadow-lg overflow-hidden border border-white/10">
            <LinearGradient
              colors={['#F97316', '#C2410C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View className="flex-row p-6 items-center justify-between">
              <View>
                <Text className="text-white/90 font-bold uppercase text-[10px] tracking-widest mb-1">Current Streak</Text>
                <Text className="text-white text-3xl font-black">{streak} <Text className="text-white/90 text-sm">Days</Text></Text>
              </View>
              <View className="w-14 h-14 bg-black/20 rounded-full items-center justify-center border border-white/20">
                <Flame size={28} color="white" fill="white" />
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ width: 3, height: 18, backgroundColor: '#F97316', borderRadius: 99, marginRight: 10 }} />
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '800', letterSpacing: -0.5 }}>Your Library</Text>
          </View>
          
          <View className="bg-noir-card border border-zinc-800 rounded-2xl overflow-hidden mb-8">
            {MENU_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const routeType = item.label.toLowerCase().replace(' ', '-');
              return (
                <PressableScale 
                  key={index}
                  onPress={() => router.push(`/library/${routeType}` as any)}
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

