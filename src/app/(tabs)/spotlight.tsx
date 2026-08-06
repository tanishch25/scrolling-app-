import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, ActivityIndicator, Share } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MessageCircle, Share2, Bookmark, Tv, Sparkles } from 'lucide-react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { PressableScale } from '../../components/ui/PressableScale';
import { useRouter } from 'expo-router';
import { useSpotlight } from '../../hooks/useQueries';
import { Skeleton } from '../../components/ui/Skeleton';

import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window');

const SpotlightItem = ({ item, isActive, containerHeight }: { item: any, isActive: boolean, containerHeight: number }) => {
  const router = useRouter();
  const [isScreenFocused, setIsScreenFocused] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      setIsScreenFocused(true);
      return () => setIsScreenFocused(false);
    }, [])
  );
  const [liked, setLiked] = useState(false);
  const [interested, setInterested] = useState(false);
  
  // Use expo-video
  const player = useVideoPlayer(item.video_url, player => {
    player.loop = true;
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  });

  // Effect to handle playing/pausing when this item scrolls into view and screen is focused
  React.useEffect(() => {
    if (isActive && isScreenFocused) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, isScreenFocused, player]);

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
        colors={['transparent', 'rgba(0,0,0,0.6)', '#000000']}
        locations={[0.4, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Content Container */}
      <View className="absolute bottom-16 left-0 right-16 p-6">
        <View className="bg-noir-primary px-2 py-1 rounded self-start mb-3 border border-orange-500/50">
          <Text className="text-white text-[10px] font-bold uppercase tracking-widest">{item.series?.genre || 'Spotlight'}</Text>
        </View>
        <Text className="text-white text-3xl font-extrabold mb-1 tracking-tight" style={styles.shadowText}>{item.series?.title || 'Unknown Series'}</Text>
        <Text className="text-zinc-300 font-bold text-xs uppercase tracking-widest mb-2 shadow-black shadow-sm">Episode {item.episodes?.episode_number || 1}: {item.episodes?.title}</Text>
        
        <Text className="text-zinc-300 text-sm font-medium leading-relaxed mb-6" numberOfLines={3} style={styles.shadowText}>
          {item.caption}
        </Text>
        
        <PressableScale 
          onPress={() => router.push(`/story/details/${item.series_id}`)}
          className="rounded-full overflow-hidden self-start"
        >
          <View className="px-6 py-3 flex-row items-center justify-center relative shadow-lg shadow-orange-500/30">
            <LinearGradient
              colors={['#F97316', '#C2410C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text className="text-white font-bold text-sm tracking-wider uppercase relative z-10">Open Series</Text>
          </View>
        </PressableScale>
      </View>

      {/* Right Sidebar Actions */}
      <View className="absolute bottom-16 right-4 items-center space-y-5">
        
        <View className="items-center">
          <PressableScale 
            onPress={() => router.push(`/story/details/${item.series_id}`)}
            className="w-12 h-12 rounded-full bg-black/40 items-center justify-center backdrop-blur-md border border-white/10 mb-1"
          >
            <Tv color="white" size={22} />
          </PressableScale>
          <Text className="text-white text-[9px] font-bold">Series</Text>
        </View>

        <View className="items-center">
          <PressableScale 
            onPress={() => setLiked(!liked)}
            className="w-12 h-12 rounded-full bg-black/40 items-center justify-center backdrop-blur-md border border-white/10 mb-1"
          >
            <Heart color={liked ? "#ef4444" : "white"} size={22} fill={liked ? "#ef4444" : "transparent"} />
          </PressableScale>
          <Text className="text-white text-[9px] font-bold">{item.engagement_score + (liked ? 1 : 0)}</Text>
        </View>
        
        <View className="items-center">
          <PressableScale className="w-12 h-12 rounded-full bg-black/40 items-center justify-center backdrop-blur-md border border-white/10 mb-1">
            <Bookmark color="white" size={22} />
          </PressableScale>
          <Text className="text-white text-[9px] font-bold">{item.saves || 0}</Text>
        </View>
        
        <View className="items-center">
          <PressableScale 
            onPress={() => {
              Share.share({
                message: `Check out ${item.series?.title || 'this series'} on Comic MicroFiction!`,
              });
            }}
            className="w-12 h-12 rounded-full bg-black/40 items-center justify-center backdrop-blur-md border border-white/10 mb-1"
          >
            <Share2 color="white" size={22} />
          </PressableScale>
          <Text className="text-white text-[9px] font-bold">Share</Text>
        </View>

        <View className="items-center">
          <PressableScale 
            onPress={() => setInterested(!interested)}
            className="w-12 h-12 rounded-full bg-black/40 items-center justify-center backdrop-blur-md border border-white/10 mb-1"
          >
            <Sparkles color={interested ? "#FBBF24" : "white"} size={22} />
          </PressableScale>
          <Text className="text-white text-[9px] font-bold text-center leading-tight">More like{'\n'}this</Text>
        </View>
      </View>
    </View>
  );
};

export default function SpotlightScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'ios' ? insets.bottom : insets.bottom + 10;
  const tabBarHeight = 60 + bottomInset;

  const { data: spotlightItems, isLoading } = useSpotlight();

  if (isLoading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  // Fallback if no database data
  if (!spotlightItems || spotlightItems.length === 0) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-8">
        <Text className="text-zinc-400 text-center font-medium">No Spotlight videos available yet. Once added via the admin panel, they will appear here.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'black', paddingBottom: tabBarHeight }}>
      <StatusBar style="light" />
      <View 
        style={{ flex: 1 }}
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
      >
        {containerHeight > 0 && (
          <FlatList 
            data={spotlightItems}
            renderItem={({ item, index }) => (
              <SpotlightItem item={item} isActive={index === currentIndex} containerHeight={containerHeight} />
            )}
            keyExtractor={(item) => item.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={containerHeight}
            snapToAlignment="start"
            decelerationRate="fast"
            bounces={false}
            disableIntervalMomentum={true}
            onMomentumScrollEnd={(ev) => {
              const index = Math.round(ev.nativeEvent.contentOffset.y / containerHeight);
              setCurrentIndex(Math.max(0, Math.min(index, spotlightItems.length - 1)));
            }}
            getItemLayout={(data, index) => ({
              length: containerHeight,
              offset: containerHeight * index,
              index,
            })}
          />
        )}
      </View>
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

