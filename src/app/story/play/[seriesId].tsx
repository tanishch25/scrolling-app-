import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { PressableScale } from '../../../components/ui/PressableScale';
import { useSeriesEpisodes } from '../../../hooks/useQueries';

const { width } = Dimensions.get('window');

const EpisodeItem = ({ item, isActive, containerHeight }: { item: any, isActive: boolean, containerHeight: number }) => {
  const player = useVideoPlayer(item.video_url, player => {
    player.loop = true;
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  });

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  return (
    <View style={{ width, height: containerHeight }} className="bg-black relative">
      <VideoView 
        player={player} 
        style={StyleSheet.absoluteFill}
        nativeControls={false}
        contentFit="cover"
      />
      
      {/* Dark Gradient Overlay for text readability */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.4)', '#000000']}
        locations={[0.5, 0.8, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Content Container */}
      <View className="absolute bottom-12 left-0 right-16 p-6">
        <Text className="text-white text-3xl font-extrabold mb-1 tracking-tight" style={styles.shadowText}>{item.title}</Text>
        <Text className="text-zinc-300 font-bold text-xs uppercase tracking-widest mb-2">Episode {item.episode_number}</Text>
        
        {item.description ? (
          <Text className="text-zinc-300 text-sm font-medium leading-relaxed" numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default function SeriesPlayerScreen() {
  const { seriesId, initialEpisodeId } = useLocalSearchParams<{ seriesId: string, initialEpisodeId: string }>();
  const router = useRouter();
  
  const { data: episodes, isLoading } = useSeriesEpisodes(seriesId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const initialScrollDone = useRef(false);

  useEffect(() => {
    // If an initialEpisodeId was provided, scroll to it once data loads
    if (episodes && episodes.length > 0 && initialEpisodeId && !initialScrollDone.current) {
      const index = episodes.findIndex((ep: any) => ep.id === initialEpisodeId);
      if (index > 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index, animated: false });
          setCurrentIndex(index);
        }, 100);
      }
      initialScrollDone.current = true;
    }
  }, [episodes, initialEpisodeId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" hidden />
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  if (!episodes || episodes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" hidden />
        <Text style={{ color: 'white' }}>No episodes found for this series.</Text>
        <PressableScale onPress={() => router.back()} style={{ marginTop: 20, padding: 10, backgroundColor: '#27272a', borderRadius: 8 }}>
          <Text style={{ color: 'white' }}>Go Back</Text>
        </PressableScale>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden />
      
      <View 
        style={{ flex: 1 }}
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
      >
        {containerHeight > 0 && (
          <FlatList 
            ref={flatListRef}
            data={episodes}
            renderItem={({ item, index }) => (
              <EpisodeItem item={item} isActive={index === currentIndex} containerHeight={containerHeight} />
            )}
            keyExtractor={(item) => item.id}
            pagingEnabled={true}
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            bounces={false}
            onMomentumScrollEnd={(ev) => {
              const index = Math.round(ev.nativeEvent.contentOffset.y / containerHeight);
              setCurrentIndex(Math.max(0, Math.min(index, episodes.length - 1)));
            }}
            getItemLayout={(data, index) => ({
              length: containerHeight,
              offset: containerHeight * index,
              index,
            })}
          />
        )}
      </View>

      {/* Close Button */}
      <PressableScale 
        onPress={() => router.back()}
        style={styles.closeButton}
      >
        <X size={24} color="white" />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  shadowText: {
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  }
});
