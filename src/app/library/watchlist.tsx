import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Bookmark } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import { PressableScale } from '../../components/ui/PressableScale';

export default function WatchlistScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [seriesList, setSeriesList] = useState<any[]>([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const listStr = await AsyncStorage.getItem('watchlist');
        if (listStr) {
          const ids = JSON.parse(listStr);
          if (ids.length > 0) {
            const { data, error } = await supabase
              .from('series')
              .select('*')
              .in('id', ids);
            
            if (data && !error) {
              setSeriesList(data);
            }
          }
        }
      } catch (e) {
        console.error('Error fetching watchlist', e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWatchlist();
  }, []);

  const handlePress = (id: string) => {
    router.push(`/story/details/${id}`);
  };

  return (
    <View className="flex-1 bg-noir-bg">
      <StatusBar style="light" />
      
      {/* Header */}
      <View className="pt-16 px-6 pb-4 flex-row items-center border-b border-zinc-800">
        <PressableScale onPress={() => router.back()} className="mr-4">
          <ChevronLeft color="white" size={28} />
        </PressableScale>
        <Text className="text-white text-2xl font-bold tracking-tight">Watchlist</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      ) : seriesList.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <Bookmark size={48} color="#3f3f46" className="mb-4" />
          <Text className="text-white text-lg font-bold mb-2">Your watchlist is empty</Text>
          <Text className="text-zinc-500 text-center">Add series you want to watch later by tapping the Watchlist button on their details page.</Text>
          
          <PressableScale 
            onPress={() => router.push('/(tabs)/explore' as any)}
            className="mt-8 bg-noir-primary px-6 py-3 rounded-full"
          >
            <Text className="text-white font-bold">Explore Series</Text>
          </PressableScale>
        </View>
      ) : (
        <FlatList
          data={seriesList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <PressableScale 
              onPress={() => handlePress(item.id)}
              className="flex-row items-center bg-noir-surface p-4 rounded-2xl border border-zinc-800 mb-4"
            >
              <Image 
                source={{ uri: item.cover_thumb_url || item.cover_large_url || 'https://via.placeholder.com/150' }} 
                className="w-20 h-28 rounded-lg mr-4 bg-zinc-900"
              />
              <View className="flex-1">
                <Text className="text-white font-bold text-xl mb-1 line-clamp-2">{item.title}</Text>
                <Text className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-3">{item.genre || 'Action'}</Text>
                <Text className="text-zinc-500 text-sm" numberOfLines={2}>{item.description}</Text>
              </View>
            </PressableScale>
          )}
        />
      )}
    </View>
  );
}

