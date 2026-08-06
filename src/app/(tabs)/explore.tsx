import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { Search, X, Flame, TrendingUp, Sparkles, BookOpen, Clock, Heart, Skull, Zap, Ghost, Moon, Smile } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableScale } from '../../components/ui/PressableScale';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { name: 'Sci-Fi', defaultCount: '0', icon: Zap, img: 'https://images.unsplash.com/photo-1618519764620-7403abdbdf9c?q=80&w=400&auto=format&fit=crop' },
  { name: 'Horror', defaultCount: '0', icon: Skull, img: 'https://images.unsplash.com/photo-1505672678657-cc70370d5e60?q=80&w=400&auto=format&fit=crop' },
  { name: 'Romance', defaultCount: '0', icon: Heart, img: 'https://images.unsplash.com/photo-1518715303843-586e350765b2?q=80&w=400&auto=format&fit=crop' },
  { name: 'Fantasy', defaultCount: '0', icon: Sparkles, img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop' },
  { name: 'Action', defaultCount: '0', icon: Flame, img: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=400&auto=format&fit=crop' },
  { name: 'Thriller', defaultCount: '0', icon: Ghost, img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop' },
  { name: 'Comedy', defaultCount: '0', icon: Smile, img: 'https://images.unsplash.com/photo-1527228113570-5b565a0b73aa?q=80&w=400&auto=format&fit=crop' },
  { name: 'Drama', defaultCount: '0', icon: BookOpen, img: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=400&auto=format&fit=crop' },
];

// Removed static TRENDING_SEARCHES

import { supabase } from '../../lib/supabase';
import { useEffect } from 'react';

export default function ExploreScreen() {
  const { query: initialQuery } = useLocalSearchParams<{ query: string }>();
  const [query, setQuery] = useState(initialQuery || '');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCountsAndImages = async () => {
      try {
        const newCounts: Record<string, number> = {};
        const newImages: Record<string, string> = {};
        
        for (const cat of CATEGORIES) {
          // Fetch count
          const { count } = await supabase
            .from('series')
            .select('*', { count: 'exact', head: true })
            .eq('genre', cat.name);
          newCounts[cat.name] = count || 0;
          
          // Fetch one recent series for image
          const { data } = await supabase
            .from('series')
            .select('cover_thumb_url, cover_large_url')
            .eq('genre', cat.name)
            .is('deleted_at', null)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (data && data.length > 0) {
            newImages[cat.name] = data[0].cover_thumb_url || data[0].cover_large_url;
          }
        }
        setCounts(newCounts);
        setCategoryImages(newImages);
      } catch (err) {
        console.error('Error fetching genre data', err);
      }
    };
    const fetchTrending = async () => {
      try {
        const { data } = await supabase
          .from('series')
          .select('title')
          .order('engagement_score', { ascending: false })
          .limit(4);
        if (data) {
          setTrendingSearches(data.map(s => s.title));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCountsAndImages();
    fetchTrending();
  }, []);

  useEffect(() => {
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    
    const searchSupabase = async () => {
      setIsSearching(true);
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .or(`title.ilike.%${query}%,genre.ilike.%${query}%`)
        .is('deleted_at', null)
        .limit(10);
        
      if (!error && data) {
        setSearchResults(data);
      }
      setIsSearching(false);
    };

    // Debounce search slightly
    const timeoutId = setTimeout(searchSupabase, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handlePress = (id: string) => {
    router.push(`/story/details/${id}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000000', paddingTop: 56 }}>
      <StatusBar style="light" />
      <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
        <Text style={{ color: 'white', fontSize: 34, fontWeight: '900', letterSpacing: -1.5, marginBottom: 16 }}>Explore</Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1B1B1B', borderRadius: 99, paddingHorizontal: 18, paddingVertical: 14, borderWidth: 1, borderColor: '#27272a' }}>
          <Search color="#F97316" size={18} />
          <TextInput 
            style={{ flex: 1, color: 'white', marginLeft: 12, fontSize: 15, fontWeight: '500' }}
            placeholder="Search titles, genres..."
            placeholderTextColor="#52525b"
            value={query}
            onChangeText={setQuery}
            selectionColor="#F97316"
          />
          {query.length > 0 && (
            <PressableScale onPress={() => setQuery('')}>
              <X color="#52525b" size={18} />
            </PressableScale>
          )}
        </View>
      </View>

      <ScrollView className="flex-1" bounces={true} contentContainerStyle={{ paddingBottom: 120 }}>
        {query.length > 0 ? (
          <View className="px-6">
            <Text className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-4">Search Results</Text>
            {isSearching ? (
              <Text className="text-zinc-500 font-medium mt-4 text-center">Searching...</Text>
            ) : searchResults.length > 0 ? (
              <View className="flex-col gap-4">
                {searchResults.map((series) => (
                  <PressableScale 
                    key={series.id} 
                    onPress={() => handlePress(series.id)}
                    className="flex-row items-center bg-noir-surface p-3 rounded-xl border border-zinc-800"
                  >
                    <Image 
                      source={{ uri: series.cover_thumb_url || series.cover_large_url || 'https://via.placeholder.com/150' }} 
                      className="w-16 h-16 rounded-lg mr-4 bg-zinc-900"
                    />
                    <View className="flex-1">
                      <Text className="text-white font-bold text-lg line-clamp-1">{series.title}</Text>
                      <Text className="text-zinc-500 text-xs mt-1">{series.genre || 'Action'}</Text>
                    </View>
                  </PressableScale>
                ))}
              </View>
            ) : (
              <View className="items-center justify-center py-20">
                <Search color="#3f3f46" size={48} />
                <Text className="text-zinc-500 font-medium mt-4">No results for "{query}"</Text>
              </View>
            )}
          </View>
        ) : (
          <View>
            {/* Trending Searches */}
            {trendingSearches.length > 0 && (
              <View className="px-6 mb-8">
              <View style={{ paddingHorizontal: 0, marginBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 3, height: 18, backgroundColor: '#F97316', borderRadius: 99, marginRight: 10 }} />
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '800', letterSpacing: -0.5 }}>Trending Now</Text>
              </View>
              <View className="flex-row flex-wrap gap-3">
                  {trendingSearches.map((search, idx) => (
                    <PressableScale 
                      key={idx} 
                      onPress={() => setQuery(search)}
                      className="bg-noir-surface px-4 py-2 rounded-full border border-zinc-800 flex-row items-center"
                    >
                      <TrendingUp size={14} color="#F97316" />
                      <Text className="text-zinc-300 font-medium ml-2">{search}</Text>
                    </PressableScale>
                  ))}
                </View>
              </View>
            )}

            {/* Cinematic Genres */}
            <View className="px-6 mb-8">
            <View style={{ paddingHorizontal: 0, marginBottom: 14, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 3, height: 18, backgroundColor: '#F97316', borderRadius: 99, marginRight: 10 }} />
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '800', letterSpacing: -0.5 }}>Browse Genres</Text>
            </View>
            <View className="flex-row flex-wrap justify-between gap-y-4">
                {CATEGORIES.map((cat, idx) => {
                  const Icon = cat.icon;
                  const displayImg = categoryImages[cat.name] || cat.img;
                  return (
                    <PressableScale 
                      key={idx}
                      onPress={() => setQuery(cat.name)}
                      className="w-[48%] h-32 rounded-2xl overflow-hidden border border-zinc-800"
                    >
                      <Image source={{ uri: displayImg }} className="absolute inset-0 w-full h-full" />
                      <LinearGradient
                        colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.9)']}
                        style={StyleSheet.absoluteFill}
                      />
                      <View className="absolute bottom-3 left-3 right-3">
                        <Text className="text-white font-extrabold text-base tracking-tight" style={styles.shadowText}>{cat.name}</Text>
                        <Text className="text-noir-primary text-[10px] font-bold uppercase tracking-wider">
                          {counts[cat.name] !== undefined ? counts[cat.name] : cat.defaultCount} Stories
                        </Text>
                      </View>
                    </PressableScale>
                  );
                })}
              </View>
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

