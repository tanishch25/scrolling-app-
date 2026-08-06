import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import { PressableScale } from '../../components/ui/PressableScale';

export default function LibraryScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Map route types to readable titles
  const titles: Record<string, string> = {
    'watchlist': 'Watchlist',
    'saved-stories': 'Saved Stories',
    'watching-history': 'Watching History',
    'liked-content': 'Liked Content',
  };

  const title = titles[type || ''] || 'Library';

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        let displayData: any[] = [];
        
        if (type === 'watchlist') {
          const stored = await AsyncStorage.getItem('watchlist');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              const ids = Array.isArray(parsed) ? parsed : [];
              if (ids.length > 0) {
                try {
                  const { data, error } = await supabase
                    .from('series')
                    .select('*')
                    .in('id', ids);
                  
                  if (error) {
                    console.log('Supabase error (likely mock IDs):', error.message);
                  } else {
                    displayData = data || [];
                  }
                } catch (e) {
                  console.log('Error querying watchlist ids:', e);
                }
                
                // If it failed or returned nothing (due to mock IDs like "1", "2"), fallback to dummy data
                if (displayData.length === 0) {
                  const { data } = await supabase.from('series').select('*').limit(ids.length);
                  displayData = data || [];
                }
              }
            } catch (parseError) {
              console.error("Error parsing watchlist", parseError);
            }
          }
        } else {
          // Dummy data for other lists until backend is wired up
          const { data, error } = await supabase
            .from('series')
            .select('*')
            .limit(8);
            
          if (error) throw error;
          displayData = data || [];
          
          if (type === 'saved-stories') displayData = displayData.slice(2, 6);
          else if (type === 'watching-history') displayData = displayData.slice(0, 5);
          else if (type === 'liked-content') displayData = displayData.slice(4, 7);
        }
        
        setItems(displayData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [type]);

  const renderItem = ({ item }: { item: any }) => (
    <PressableScale 
      onPress={() => router.push(`/story/details/${item.id}`)}
      className="flex-1 m-2 bg-noir-card rounded-lg overflow-hidden border border-zinc-800"
    >
      <Image 
        source={{ uri: item.cover_thumb_url || item.cover_large_url || 'https://via.placeholder.com/400' }}
        className="w-full h-48"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="text-white font-bold text-sm mb-1" numberOfLines={1}>{item.title}</Text>
        <Text className="text-zinc-500 text-[10px] uppercase tracking-wider">{item.genre || 'Originals'}</Text>
      </View>
    </PressableScale>
  );

  return (
    <View className="flex-1 bg-noir-bg pt-14">
      <StatusBar style="light" />
      
      {/* Header */}
      <View className="px-6 flex-row items-center mb-6">
        <PressableScale onPress={() => router.back()} className="w-10 h-10 bg-noir-surface rounded-full items-center justify-center border border-zinc-800">
          <ChevronLeft color="white" size={24} />
        </PressableScale>
        <Text className="text-white text-2xl font-extrabold ml-4">{title}</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#F97316" />
        </View>
      ) : items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-zinc-500 font-bold text-lg text-center mb-2">Nothing here yet</Text>
          <Text className="text-zinc-600 text-sm text-center">Start exploring and add content to your {title.toLowerCase()}!</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
