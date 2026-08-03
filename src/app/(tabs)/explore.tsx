import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const CATEGORIES = [
  { name: 'Sci-Fi', img: 'https://images.unsplash.com/photo-1618519764620-7403abdbdf9c?q=80&w=400&auto=format&fit=crop' },
  { name: 'Horror', img: 'https://images.unsplash.com/photo-1505672678657-cc70370d5e60?q=80&w=400&auto=format&fit=crop' },
  { name: 'Romance', img: 'https://images.unsplash.com/photo-1518715303843-586e350765b2?q=80&w=400&auto=format&fit=crop' },
  { name: 'Thriller', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop' },
  { name: 'Fantasy', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop' },
  { name: 'Mystery', img: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=400&auto=format&fit=crop' },
];

const SEARCH_RESULTS = [
  { id: '1', title: 'Cyber Heist', genre: 'Sci-Fi', img: 'https://images.unsplash.com/photo-1618519764620-7403abdbdf9c?q=80&w=400&auto=format&fit=crop' },
  { id: '2', title: 'Neon Shadows', genre: 'Sci-Fi', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop' },
];

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handlePress = (id: string) => {
    router.push(`/story/details/${id}`);
  };

  return (
    <View className="flex-1 bg-[#09090b] pt-16">
      <StatusBar style="light" />
      <View className="px-4 mb-6">
        <Text className="text-white text-4xl font-black tracking-tighter mb-4" style={styles.shadowText}>
          Explore
        </Text>
        
        <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
          <Search color="#71717a" size={20} />
          <TextInput 
            className="flex-1 text-white ml-3 font-medium"
            placeholder="Search stories, genres, authors..."
            placeholderTextColor="#71717a"
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X color="#71717a" size={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-4" bounces={true} contentContainerStyle={{ paddingBottom: 100 }}>
        {query.length > 0 ? (
          <View>
            <Text className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-4">Search Results</Text>
            {SEARCH_RESULTS.map((story) => (
              <TouchableOpacity 
                key={story.id} 
                activeOpacity={0.8}
                onPress={() => handlePress(story.id)}
                className="flex-row bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 mb-4 h-28"
              >
                <Image source={{ uri: story.img }} className="w-28 h-full bg-zinc-800" />
                <View className="flex-1 p-4 justify-center">
                  <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">{story.genre}</Text>
                  <Text className="text-white text-xl font-bold tracking-tight">{story.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View>
            <Text className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-4">Browse Genres</Text>
            <View className="flex-row flex-wrap justify-between gap-y-4">
              {CATEGORIES.map((cat, idx) => (
                <TouchableOpacity 
                  key={idx}
                  activeOpacity={0.8}
                  className="w-[48%] h-28 rounded-xl border border-zinc-800 overflow-hidden"
                >
                  <Image source={{ uri: cat.img }} className="absolute inset-0 w-full h-full" />
                  <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View className="absolute bottom-3 left-3 right-3">
                    <Text className="text-white font-black text-lg tracking-tight" style={styles.shadowText}>{cat.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowText: {
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  }
});
