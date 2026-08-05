import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Play, Plus, ChevronLeft, Star, Clock, Eye, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { PressableScale } from '../../../components/ui/PressableScale';
import { useSeriesDetails, useSeriesEpisodes } from '../../../hooks/useQueries';

const { width } = Dimensions.get('window');

export default function StoryDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: series, isLoading: loadingSeries } = useSeriesDetails(id);
  const { data: episodes, isLoading: loadingEpisodes } = useSeriesEpisodes(id);

  if (loadingSeries || loadingEpisodes) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  if (!series) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">Series not found</Text>
        <PressableScale onPress={() => router.back()} className="mt-4 p-2 bg-zinc-800 rounded">
          <Text className="text-white">Go Back</Text>
        </PressableScale>
      </View>
    );
  }

  const handlePlay = (episodeId: string) => {
    // In the future this will open the full screen video player
    router.push(`/story/${episodeId}`);
  };

  return (
    <ScrollView className="flex-1 bg-noir-bg" bounces={false} contentContainerStyle={{ paddingBottom: 120 }}>
      <StatusBar style="light" />
      
      {/* Hero Header */}
      <View style={{ width, height: 480 }} className="relative">
        <Image 
          source={{ uri: series.cover_large_url || series.cover_thumb_url || 'https://images.unsplash.com/photo-1618519764620-7403abdbdf9c?q=80&w=800&auto=format&fit=crop' }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)', '#000000']}
          style={StyleSheet.absoluteFill}
          locations={[0, 0.3, 0.7, 1]}
        />
        
        <View className="absolute top-14 left-6 z-50 flex-row w-full justify-between pr-12">
          <PressableScale onPress={() => router.back()} className="w-10 h-10 bg-black/40 rounded-full items-center justify-center backdrop-blur-md border border-white/10">
            <ChevronLeft color="white" size={24} />
          </PressableScale>
          <PressableScale className="w-10 h-10 bg-black/40 rounded-full items-center justify-center backdrop-blur-md border border-white/10">
            <Share2 color="white" size={20} />
          </PressableScale>
        </View>

        <View className="absolute bottom-6 left-0 right-0 px-6">
          <View className="flex-row items-center space-x-2 mb-3">
            <Text className="text-noir-primary font-bold tracking-widest uppercase text-[10px]">{series.genre || 'Action'}</Text>
            {series.tags && series.tags.map((tag: string, i: number) => (
              <React.Fragment key={i}>
                <Text className="text-zinc-600 font-bold tracking-widest uppercase text-[10px]">•</Text>
                <Text className="text-zinc-600 font-bold tracking-widest uppercase text-[10px]">{tag}</Text>
              </React.Fragment>
            ))}
          </View>
          <Text className="text-white text-5xl font-extrabold tracking-tight mb-4" style={styles.shadowText}>
            {series.title}
          </Text>
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center">
              <Star color="#D4A017" size={16} fill="#D4A017" />
              <Text className="text-white ml-1.5 font-bold">{series.average_rating || 0}</Text>
            </View>
            <View className="w-1 h-1 rounded-full bg-zinc-600" />
            <View className="flex-row items-center">
              <Eye color="#A1A1AA" size={16} />
              <Text className="text-zinc-400 ml-1.5 font-medium">{series.total_views || 0}</Text>
            </View>
            <View className="bg-noir-primary/20 border border-noir-primary/30 px-2 py-0.5 rounded ml-auto">
              <Text className="text-noir-primary font-bold text-[9px] tracking-widest uppercase">{series.status || 'Ongoing'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="px-6 py-2">
        {/* Actions */}
        <View className="flex-row items-center gap-4 mb-8 mt-2">
          <PressableScale 
            onPress={() => episodes && episodes.length > 0 ? handlePlay(episodes[0].id) : null}
            className="flex-1 rounded-full overflow-hidden"
          >
            <LinearGradient
              colors={['#F97316', '#C2410C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="py-3.5 flex-row items-center justify-center border-t border-[#FF9852]"
            >
              <Play size={20} color="white" fill="white" />
              <Text className="text-white font-bold ml-2 text-base">Watch Now</Text>
            </LinearGradient>
          </PressableScale>

          <PressableScale 
            className="bg-noir-surface py-3.5 rounded-full flex-row items-center justify-center flex-1 border border-zinc-800"
          >
            <Plus size={20} color="white" />
            <Text className="text-white font-bold ml-2 text-base">Save</Text>
          </PressableScale>
        </View>

        {/* Synopsis */}
        <Text className="text-white text-lg font-bold mb-3">Synopsis</Text>
        <Text className="text-zinc-400 text-sm font-medium leading-loose mb-10">
          {series.description || 'No description available.'}
        </Text>

        {/* Episodes List */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-lg font-bold">Episodes</Text>
          <Text className="text-zinc-500 font-medium text-xs">{series.total_episodes || (episodes ? episodes.length : 0)} Available</Text>
        </View>
        
        {(!episodes || episodes.length === 0) ? (
          <Text className="text-zinc-500 italic mt-4 text-center">No episodes available yet.</Text>
        ) : (
          episodes.map((ep: any) => (
            <PressableScale 
              key={ep.id}
              onPress={() => handlePlay(ep.id)}
              className="flex-row bg-noir-card rounded-2xl overflow-hidden border border-zinc-800 mb-4 h-28"
            >
              <Image 
                source={{ uri: ep.thumbnail_url || series.cover_thumb_url || 'https://images.unsplash.com/photo-1618519764620-7403abdbdf9c?q=80&w=200&auto=format&fit=crop' }}
                className="w-24 h-full"
              />
              <View className="flex-1 p-4 justify-center bg-noir-card">
                <Text className="text-noir-primary text-[10px] font-bold uppercase tracking-widest mb-1">Episode {ep.episode_number}</Text>
                <Text className="text-white font-bold text-base mb-1" numberOfLines={1}>{ep.title}</Text>
                <Text className="text-zinc-500 text-xs font-medium">
                  {ep.duration ? `${Math.floor(ep.duration / 60)}m ${ep.duration % 60}s` : 'Video'}
                </Text>
              </View>
              <View className="w-16 items-center justify-center">
                <View className="w-8 h-8 rounded-full bg-noir-surface items-center justify-center">
                  <Play size={14} color="#F97316" fill="#F97316" className="ml-1" />
                </View>
              </View>
            </PressableScale>
          ))
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  shadowText: {
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  }
});
