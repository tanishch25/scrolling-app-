import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { PressableScale } from '../../components/ui/PressableScale';
import { useRouter } from 'expo-router';
import { useSpotlight } from '../../hooks/useQueries';
import { Skeleton } from '../../components/ui/Skeleton';

const { width, height } = Dimensions.get('window');

const SpotlightItem = ({ item, isActive }: { item: any, isActive: boolean }) => {
  const router = useRouter();
  
  // Use expo-video
  const player = useVideoPlayer(item.video_url, player => {
    player.loop = true;
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  });

  // Effect to handle playing/pausing when this item scrolls into view
  React.useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  return (
    <View style={{ width, height }} className="bg-black relative">
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
      <View className="absolute bottom-24 left-0 right-16 p-6">
        <View className="bg-noir-primary px-2 py-1 rounded self-start mb-3">
          <Text className="text-white text-[10px] font-bold uppercase tracking-widest">{item.series?.genre || 'Spotlight'}</Text>
        </View>
        <Text className="text-white text-3xl font-extrabold mb-1 tracking-tight" style={styles.shadowText}>{item.series?.title || 'Unknown Series'}</Text>
        <Text className="text-zinc-300 font-bold text-xs uppercase tracking-widest mb-2">Episode {item.episodes?.episode_number || 1}: {item.episodes?.title}</Text>
        
        <Text className="text-zinc-300 text-sm font-medium leading-relaxed mb-6" numberOfLines={3}>
          {item.caption}
        </Text>
        
        <PressableScale 
          onPress={() => router.push(`/story/details/${item.series_id}`)}
          className="rounded-full overflow-hidden self-start"
        >
          <LinearGradient
            colors={['#F97316', '#C2410C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-6 py-3 flex-row items-center border-t border-[#FF9852]"
          >
            <Text className="text-white font-bold text-sm tracking-wider uppercase">Open Series</Text>
          </LinearGradient>
        </PressableScale>
      </View>

      {/* Right Sidebar Actions */}
      <View className="absolute bottom-28 right-4 items-center space-y-6">
        <View className="items-center">
          <PressableScale className="w-12 h-12 rounded-full bg-black/40 items-center justify-center backdrop-blur-md border border-white/10 mb-1">
            <Heart color="white" size={24} />
          </PressableScale>
          <Text className="text-white text-[10px] font-bold">{item.engagement_score || 0}</Text>
        </View>
        
        <View className="items-center">
          <PressableScale className="w-12 h-12 rounded-full bg-black/40 items-center justify-center backdrop-blur-md border border-white/10 mb-1">
            <MessageCircle color="white" size={24} />
          </PressableScale>
          <Text className="text-white text-[10px] font-bold">Comment</Text>
        </View>

        <View className="items-center">
          <PressableScale className="w-12 h-12 rounded-full bg-black/40 items-center justify-center backdrop-blur-md border border-white/10 mb-1">
            <Bookmark color="white" size={24} />
          </PressableScale>
          <Text className="text-white text-[10px] font-bold">{item.saves || 0}</Text>
        </View>
        
        <View className="items-center">
          <PressableScale className="w-12 h-12 rounded-full bg-black/40 items-center justify-center backdrop-blur-md border border-white/10 mb-1">
            <Share2 color="white" size={24} />
          </PressableScale>
          <Text className="text-white text-[10px] font-bold">{item.shares || 0}</Text>
        </View>
      </View>
    </View>
  );
};

export default function SpotlightScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
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
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <FlatList 
        data={spotlightItems}
        renderItem={({ item, index }) => (
          <SpotlightItem item={item} isActive={index === currentIndex} />
        )}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        onMomentumScrollEnd={(ev) => {
          const index = Math.round(ev.nativeEvent.contentOffset.y / height);
          setCurrentIndex(index);
        }}
      />
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
