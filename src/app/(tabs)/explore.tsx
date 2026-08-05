import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { Search, X, Flame, TrendingUp, Sparkles, BookOpen, Clock, Heart, Skull, Zap, Ghost, Moon, Smile } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableScale } from '../../components/ui/PressableScale';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { name: 'Sci-Fi', count: '12K', icon: Zap, img: 'https://images.unsplash.com/photo-1618519764620-7403abdbdf9c?q=80&w=400&auto=format&fit=crop' },
  { name: 'Horror', count: '8K', icon: Skull, img: 'https://images.unsplash.com/photo-1505672678657-cc70370d5e60?q=80&w=400&auto=format&fit=crop' },
  { name: 'Romance', count: '24K', icon: Heart, img: 'https://images.unsplash.com/photo-1518715303843-586e350765b2?q=80&w=400&auto=format&fit=crop' },
  { name: 'Fantasy', count: '18K', icon: Sparkles, img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop' },
];

const MOODS = [
  { name: 'Dark', icon: Moon, color: '#312e81' },
  { name: 'Scary', icon: Ghost, color: '#7f1d1d' },
  { name: 'Funny', icon: Smile, color: '#166534' },
  { name: 'Hopeful', icon: Sparkles, color: '#854d0e' },
];

const TRENDING_SEARCHES = ['Cyberpunk City', 'Vampire Romance', 'Space Opera', 'Detective Mystery'];

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handlePress = (id: string) => {
    router.push(`/story/details/${id}`);
  };

  return (
    <View className="flex-1 bg-noir-bg pt-16">
      <StatusBar style="light" />
      <View className="px-6 mb-6">
        <Text className="text-white text-4xl font-extrabold tracking-tight mb-6" style={styles.shadowText}>
          Explore
        </Text>
        
        <View className="flex-row items-center bg-noir-surface rounded-full px-5 py-3.5 border border-zinc-800">
          <Search color="#F97316" size={20} />
          <TextInput 
            className="flex-1 text-white ml-3 font-medium text-base"
            placeholder="Search titles, authors, genres..."
            placeholderTextColor="#71717a"
            value={query}
            onChangeText={setQuery}
            selectionColor="#F97316"
          />
          {query.length > 0 && (
            <PressableScale onPress={() => setQuery('')}>
              <X color="#F97316" size={20} />
            </PressableScale>
          )}
        </View>
      </View>

      <ScrollView className="flex-1" bounces={true} contentContainerStyle={{ paddingBottom: 120 }}>
        {query.length > 0 ? (
          <View className="px-6">
            <Text className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-4">Search Results</Text>
            {/* Empty state for demo */}
            <View className="items-center justify-center py-20">
              <Search color="#3f3f46" size={48} />
              <Text className="text-zinc-500 font-medium mt-4">No results for "{query}"</Text>
            </View>
          </View>
        ) : (
          <View>
            {/* Trending Searches */}
            <View className="px-6 mb-8">
              <Text className="text-white font-bold text-lg mb-4">Trending Searches</Text>
              <View className="flex-row flex-wrap gap-3">
                {TRENDING_SEARCHES.map((search, idx) => (
                  <PressableScale key={idx} className="bg-noir-surface px-4 py-2 rounded-full border border-zinc-800 flex-row items-center">
                    <TrendingUp size={14} color="#F97316" />
                    <Text className="text-zinc-300 font-medium ml-2">{search}</Text>
                  </PressableScale>
                ))}
              </View>
            </View>

            {/* Cinematic Genres */}
            <View className="px-6 mb-8">
              <Text className="text-white font-bold text-lg mb-4">Cinematic Genres</Text>
              <View className="flex-row flex-wrap justify-between gap-y-4">
                {CATEGORIES.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <PressableScale 
                      key={idx}
                      className="w-[48%] h-32 rounded-2xl overflow-hidden border border-zinc-800"
                    >
                      <Image source={{ uri: cat.img }} className="absolute inset-0 w-full h-full" />
                      <LinearGradient
                        colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.9)']}
                        style={StyleSheet.absoluteFill}
                      />
                      <View className="absolute top-3 left-3 bg-black/50 p-1.5 rounded-full backdrop-blur-md">
                        <Icon size={14} color="#ffffff" />
                      </View>
                      <View className="absolute bottom-3 left-3 right-3">
                        <Text className="text-white font-extrabold text-base tracking-tight" style={styles.shadowText}>{cat.name}</Text>
                        <Text className="text-noir-primary text-[10px] font-bold uppercase tracking-wider">{cat.count} Stories</Text>
                      </View>
                    </PressableScale>
                  );
                })}
              </View>
            </View>

            {/* Browse by Mood */}
            <View className="px-6 mb-8">
              <Text className="text-white font-bold text-lg mb-4">Browse by Mood</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible pr-6">
                {MOODS.map((mood, idx) => {
                  const Icon = mood.icon;
                  return (
                    <PressableScale 
                      key={idx}
                      className="w-24 h-28 rounded-2xl mr-4 items-center justify-center border border-zinc-800 relative overflow-hidden"
                      style={{ backgroundColor: mood.color }}
                    >
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={StyleSheet.absoluteFill}
                      />
                      <Icon size={28} color="#ffffff" style={{ opacity: 0.9, marginBottom: 8 }} />
                      <Text className="text-white font-bold text-sm">{mood.name}</Text>
                    </PressableScale>
                  );
                })}
              </ScrollView>
            </View>

            {/* Editor's Picks */}
            <View className="px-6 mb-8">
              <View className="flex-row items-center mb-4">
                <Text className="text-white font-bold text-lg mr-2">Editor's Picks</Text>
                <View className="bg-noir-accent px-2 py-0.5 rounded">
                  <Text className="text-black font-bold text-[9px] uppercase tracking-widest">Premium</Text>
                </View>
              </View>
              
              <PressableScale 
                onPress={() => handlePress('2')}
                className="w-full h-48 rounded-2xl overflow-hidden border border-zinc-800"
              >
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop' }}
                  className="absolute inset-0 w-full h-full"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.9)']}
                  style={StyleSheet.absoluteFill}
                />
                <View className="absolute bottom-4 left-4 right-4">
                  <Text className="text-white font-extrabold text-2xl tracking-tight mb-1" style={styles.shadowText}>The Matrix Protocol</Text>
                  <Text className="text-zinc-300 font-medium text-xs mb-3">A detective must solve a murder inside a fully immersive virtual reality where death is permanent.</Text>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center space-x-3">
                      <Text className="text-noir-primary text-[10px] font-bold uppercase tracking-widest">Mystery</Text>
                      <Text className="text-zinc-400 text-[10px] font-medium">• 1h 20m</Text>
                    </View>
                    <LinearGradient
                      colors={['#F97316', '#C2410C']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="px-4 py-1.5 rounded-full border-t border-[#FF9852]"
                    >
                      <Text className="text-white font-bold text-[10px] uppercase tracking-widest">Read</Text>
                    </LinearGradient>
                  </View>
                </View>
              </PressableScale>
            </View>

          </View>
        )}
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
