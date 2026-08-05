import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
} from 'react-native-reanimated';
import { useTrendingSeries, useNewReleases } from '../../hooks/useQueries';
import { PressableScale } from '../../components/ui/PressableScale';
import { Skeleton } from '../../components/ui/Skeleton';

const { width } = Dimensions.get('window');

const HERO_SLIDES = [
  {
    id: '1',
    title: 'Cyber Heist',
    genre: 'Sci-Fi • Cyberpunk',
    teaser: 'In a city of neon and chrome, a single hack could change everything.',
    image: 'https://images.unsplash.com/photo-1618519764620-7403abdbdf9c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Neon Nights',
    genre: 'Action • Thriller',
    teaser: 'The rain never stops, and neither do the shadows chasing him.',
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Solar Flare',
    genre: 'Apocalyptic • Action',
    teaser: 'When the sun suddenly expands, humanity has 8 minutes left.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'Midnight Protocol',
    genre: 'Mystery • Detective',
    teaser: 'A detective must solve a murder inside a fully immersive virtual reality.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'
  }
];

const GENRES = [
  { id: 'g1', name: 'Romance', color: '#E11D48' },
  { id: 'g2', name: 'Fantasy', color: '#7C3AED' },
  { id: 'g3', name: 'Action', color: '#DC2626' },
  { id: 'g4', name: 'Thriller', color: '#059669' },
  { id: 'g5', name: 'Sci-Fi', color: '#2563EB' },
  { id: 'g6', name: 'Comedy', color: '#D97706' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { data: topPicks, isLoading: topPicksLoading } = useTrendingSeries();
  const [activeSlide, setActiveSlide] = useState(0);

  const handlePress = (id: string) => {
    router.push(`/story/details/${id}`);
  };

  const renderHeroItem = ({ item }: { item: typeof HERO_SLIDES[0] }) => {
    return (
      <View style={{ width, height: 500 }} className="relative">
        <Image 
          source={{ uri: item.image }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.8)', '#000000']}
          style={StyleSheet.absoluteFill}
          locations={[0, 0.3, 0.7, 1]}
        />
        
        {/* Top Right App Icon */}
        <View className="absolute top-14 right-6">
          <Image 
            source={require('../../../assets/images/icon.png')}
            className="w-10 h-10 rounded shadow-lg"
          />
        </View>

        <View className="absolute bottom-8 left-0 right-0 px-6">
          <View className="flex-row items-center justify-center space-x-3 mb-2">
            <Text className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em]">{item.genre}</Text>
          </View>
          
          <Text className="text-white text-5xl font-black text-center mb-4 tracking-tighter" style={styles.shadowText}>
            {item.title}
          </Text>
          
          <Text className="text-zinc-300 text-center font-medium text-sm mb-6 px-8 leading-relaxed">
            {item.teaser}
          </Text>
          
          <View className="flex-row items-center w-full justify-center space-x-3">
            <PressableScale 
              onPress={() => handlePress(item.id)}
              className="rounded-full overflow-hidden flex-1 max-w-[180px]"
            >
              <LinearGradient
                colors={['#F97316', '#C2410C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-3.5 flex-row items-center justify-center border-t border-[#FF9852]"
              >
                <Play size={16} color="white" fill="white" />
                <Text className="text-white font-bold ml-2 text-sm tracking-widest uppercase">Start Watching</Text>
              </LinearGradient>
            </PressableScale>
            
            <PressableScale 
              className="bg-zinc-900/80 px-6 py-3.5 rounded-full flex-row items-center justify-center border border-zinc-700 backdrop-blur-md"
            >
              <Plus size={18} color="white" />
              <Text className="text-white font-bold ml-2 text-sm tracking-widest uppercase">Subscribe</Text>
            </PressableScale>
          </View>
        </View>
      </View>
    );
  };

  const renderHorizontalStory = ({ item }: { item: any }) => (
    <PressableScale 
      onPress={() => handlePress(item.id)}
      className="w-36 mr-4 relative rounded-md overflow-hidden bg-noir-card border border-zinc-800"
    >
      <Image 
        source={{ uri: item.cover_url || item.img }}
        className="w-full h-52"
      />
      <LinearGradient
        colors={['transparent', 'rgba(17,17,17,0.8)', '#111111']}
        className="absolute bottom-0 left-0 right-0 h-24"
      />
      <View className="absolute bottom-2 left-2 right-2 px-1">
        <Text className="text-white font-bold text-sm" numberOfLines={1}>{item.title}</Text>
        <Text className="text-zinc-400 text-[10px] mt-1 uppercase tracking-wider">{item.genre || 'Originals'}</Text>
      </View>
    </PressableScale>
  );

  const renderGenre = ({ item }: { item: typeof GENRES[0] }) => (
    <PressableScale className="w-40 mr-4 h-24 rounded-lg overflow-hidden justify-end p-4 border border-zinc-800" style={{ backgroundColor: item.color }}>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        style={StyleSheet.absoluteFill}
      />
      <Text className="text-white font-bold text-lg tracking-widest uppercase relative z-10">{item.name}</Text>
    </PressableScale>
  );

  return (
    <FlatList 
      data={[{ key: 'content' }]}
      className="flex-1 bg-noir-bg"
      bounces={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
      renderItem={() => (
        <View>
          {/* Hero Carousel */}
          <FlatList 
            data={HERO_SLIDES}
            renderItem={renderHeroItem}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={width}
            snapToAlignment="start"
            decelerationRate="fast"
            bounces={false}
            onMomentumScrollEnd={(ev) => {
              const index = Math.round(ev.nativeEvent.contentOffset.x / width);
              setActiveSlide(index);
            }}
          />
          
          {/* Pagination Dots */}
          <View className="flex-row justify-center items-center mt-4 space-x-2">
            {HERO_SLIDES.map((_, i) => (
              <View 
                key={i} 
                className={`h-1.5 rounded-full ${i === activeSlide ? 'w-4 bg-noir-primary' : 'w-1.5 bg-zinc-700'}`}
              />
            ))}
          </View>

          {/* Top Picks For You */}
          <View className="mt-8 pl-6">
            <Text className="text-white text-xl font-bold mb-4 tracking-tight">Top Picks For You</Text>
            {topPicksLoading ? (
              <FlatList 
                data={[1, 2, 3]}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={() => <Skeleton className="w-36 h-52 mr-4 rounded-md" />}
              />
            ) : (
              <FlatList 
                data={topPicks}
                renderItem={renderHorizontalStory}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={144 + 16} // width (144) + margin (16)
                snapToAlignment="start"
                decelerationRate="fast"
                contentContainerStyle={{ paddingRight: 24 }}
              />
            )}
          </View>

          {/* Genres */}
          <View className="mt-10 pl-6 mb-8">
            <Text className="text-white text-xl font-bold mb-4 tracking-tight">Genres</Text>
            <FlatList 
              data={GENRES}
              renderItem={renderGenre}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={160 + 16} // width (160) + margin (16)
              snapToAlignment="start"
              decelerationRate="fast"
              contentContainerStyle={{ paddingRight: 24 }}
            />
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  shadowText: {
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  }
});
