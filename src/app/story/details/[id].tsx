import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Play, Plus, ChevronLeft, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function StoryDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const handlePlay = () => {
    router.push(`/story/${id}`);
  };

  return (
    <ScrollView className="flex-1 bg-[#09090b]" bounces={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <StatusBar style="light" />
      
      {/* Hero Header */}
      <View style={{ width, height: 400 }} className="relative">
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1618519764620-7403abdbdf9c?q=80&w=800&auto=format&fit=crop' }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', '#09090b']}
          style={StyleSheet.absoluteFill}
          locations={[0.4, 1]}
        />
        
        <View className="absolute top-12 left-4 z-50">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-black/50 rounded-full">
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
        </View>

        <View className="absolute bottom-4 left-0 right-0 px-6">
          <Text className="text-zinc-400 font-bold tracking-widest uppercase text-xs mb-2">Sci-Fi • Thriller</Text>
          <Text className="text-white text-5xl font-black tracking-tight">
            Cyber Heist
          </Text>
          <View className="flex-row items-center mt-2 gap-4">
            <View className="flex-row items-center">
              <Star color="#eab308" size={16} fill="#eab308" />
              <Text className="text-white ml-1 font-bold">4.8</Text>
            </View>
            <Text className="text-zinc-400 font-medium">1.2M Reads</Text>
            <Text className="text-white font-bold bg-zinc-800 px-2 rounded-sm text-xs">ONGOING</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="px-6 py-6">
        {/* Actions */}
        <View className="flex-row items-center gap-4 mb-8">
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={handlePlay}
            className="bg-white py-3 rounded-full flex-row items-center justify-center flex-1"
          >
            <Play size={20} color="black" fill="black" />
            <Text className="text-black font-bold ml-2 text-lg">Play</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.8}
            className="bg-zinc-800 py-3 rounded-full flex-row items-center justify-center flex-1"
          >
            <Plus size={20} color="white" />
            <Text className="text-white font-bold ml-2 text-lg">My List</Text>
          </TouchableOpacity>
        </View>

        {/* Synopsis */}
        <Text className="text-white text-lg font-bold mb-2">Synopsis</Text>
        <Text className="text-zinc-400 text-base leading-relaxed mb-8">
          In the neon-drenched streets of Neo-Veridia, a rogue AI named 'Cipher' has stolen the city's central consciousness. Follow Jax, a disgraced net-runner, as he navigates the underbelly of the cyber-mafia to get it back. The clock is ticking, and every choice matters.
        </Text>

        {/* Episodes/Seasons List */}
        <Text className="text-white text-lg font-bold mb-4">Seasons</Text>
        
        {/* Season 1 Card */}
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={handlePlay}
          className="flex-row bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 mb-4 h-24"
        >
          <View className="flex-1 p-4 justify-center">
            <Text className="text-white font-bold text-lg">Season 1: The Breach</Text>
            <Text className="text-zinc-500 mt-1">60 Slides • 15 Mins</Text>
          </View>
          <View className="w-16 items-center justify-center border-l border-zinc-800">
            <Play size={24} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Season 2 Card (Locked/Upcoming) */}
        <View className="flex-row bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800 h-24 opacity-60">
          <View className="flex-1 p-4 justify-center">
            <Text className="text-white font-bold text-lg">Season 2: Dark Net</Text>
            <Text className="text-zinc-500 mt-1">Coming Soon</Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}
