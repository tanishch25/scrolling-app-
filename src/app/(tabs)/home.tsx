import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, FlatList, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Plus, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTrendingSeries, useFeaturedSeries, useAllSeries } from '../../hooks/useQueries';
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
  const { data: heroSeries, isLoading: heroLoading } = useFeaturedSeries();
  const { data: allSeries, isLoading: allSeriesLoading } = useAllSeries();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeGenreTab, setActiveGenreTab] = useState<string>('All');
  const [watchlistedIds, setWatchlistedIds] = useState<Set<string>>(new Set());

  const toggleWatchlist = useCallback(async (id: string) => {
    try {
      const listStr = await AsyncStorage.getItem('watchlist');
      const ids: string[] = listStr ? JSON.parse(listStr) : [];
      let newIds: string[];
      if (ids.includes(id)) {
        newIds = ids.filter((i) => i !== id);
      } else {
        newIds = [...ids, id];
      }
      await AsyncStorage.setItem('watchlist', JSON.stringify(newIds));
      setWatchlistedIds(new Set(newIds));
    } catch (e) {
      console.error('Watchlist error', e);
    }
  }, []);

  const dynamicGenres = React.useMemo(() => {
    if (!allSeries) return GENRES;
    
    // Get unique genres from DB, filter out undefined/null
    const uniqueGenres = Array.from(new Set(allSeries.map((s: any) => s.genre).filter(Boolean)));
    
    // Map to objects with colors
    const colors = ['#E11D48', '#7C3AED', '#DC2626', '#059669', '#2563EB', '#D97706', '#DB2777', '#0EA5E9', '#8B5CF6', '#14B8A6'];
    
    return uniqueGenres.map((name: any, idx) => {
      const existing = GENRES.find(g => g.name.toLowerCase() === name.toLowerCase());
      return {
        id: `dg-${idx}`,
        name,
        color: existing ? existing.color : colors[idx % colors.length]
      };
    });
  }, [allSeries]);

  const handlePress = (id: string) => {
    router.push(`/story/details/${id}`);
  };

  const renderHeroItem = ({ item }: { item: any }) => {
    const imageUri = item.image || item.cover_large_url || item.cover_url || item.cover_thumb_url;
    const description = item.teaser || item.description || '';
    const isWatchlisted = watchlistedIds.has(item.id);
    return (
      <View style={{ width }} className="px-5 pt-32 pb-2">
        {/* Compact Hero Card - smaller than screen with rounded corners */}
        <View style={{ height: 400, borderRadius: 28, overflow: 'hidden' }}>
          {/* Thumbnail - using absoluteFill with explicit pixel size */}
          <Image 
            source={imageUri ? { uri: imageUri } : require('../../../assets/images/icon.png')}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: width - 40, height: 400 }}
            resizeMode="cover"
          />
          {/* Gradient only at very bottom so thumbnail shows clearly */}
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.98)']}
            style={StyleSheet.absoluteFill}
            locations={[0, 0.5, 0.75, 1]}
          />

          {/* Bottom Content - all center aligned */}
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, alignItems: 'center' }}>
            {/* Genre - plain text, no box */}
            <Text style={{ color: '#a1a1aa', fontWeight: '700', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
              {item.genre}
            </Text>

            {/* Title - center */}
            <Text style={{ color: 'white', fontSize: 32, fontWeight: '900', letterSpacing: -1, textAlign: 'center', marginBottom: 8, textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 10 }} numberOfLines={1}>
              {item.title}
            </Text>

            {/* Description - center, below title */}
            <Text style={{ color: '#d4d4d8', fontSize: 12, fontWeight: '500', textAlign: 'center', marginBottom: 18, lineHeight: 18, paddingHorizontal: 8 }} numberOfLines={3}>
              {description}
            </Text>
            
            {/* Buttons - equal width, same style, side by side */}
            <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
              <PressableScale 
                onPress={() => handlePress(item.id)}
                style={{ flex: 1, borderRadius: 16, overflow: 'hidden' }}
              >
                <LinearGradient
                  colors={['#F97316', '#C2410C']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ paddingVertical: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 16 }}
                >
                  <Play size={15} color="white" fill="white" />
                  <Text style={{ color: 'white', fontWeight: '700', marginLeft: 7, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>Watch</Text>
                </LinearGradient>
              </PressableScale>
              
              <PressableScale 
                onPress={() => toggleWatchlist(item.id)}
                style={{ flex: 1, borderRadius: 16, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: isWatchlisted ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: isWatchlisted ? 'rgba(249,115,22,0.6)' : 'rgba(255,255,255,0.25)' }}
              >
                {isWatchlisted 
                  ? <Check size={15} color="#F97316" />
                  : <Plus size={15} color="white" />}
                <Text style={{ color: isWatchlisted ? '#F97316' : 'white', fontWeight: '700', marginLeft: 7, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {isWatchlisted ? 'Added' : 'Watchlist'}
                </Text>
              </PressableScale>
            </View>
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
        source={{ uri: item.cover_url || item.cover_thumb_url || item.img || 'https://via.placeholder.com/400' }}
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

  return (
    <View className="flex-1 bg-noir-bg" style={{ position: 'relative' }}>
      <FlatList 
        data={[{ key: 'content' }]}
        className="flex-1"
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={() => (
          <View>
            {/* Hero Carousel */}
            {heroLoading ? (
              <Skeleton className="mx-5 mt-5" style={{ height: 420, borderRadius: 24 }} />
          ) : (
            <FlatList 
              data={(heroSeries && heroSeries.length > 0) ? heroSeries : HERO_SLIDES}
              renderItem={renderHeroItem}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={width}
              snapToAlignment="start"
              decelerationRate="fast"
              bounces={false}
              disableIntervalMomentum={true}
              getItemLayout={(_: any, index: number) => ({
                length: width,
                offset: width * index,
                index,
              })}
              onMomentumScrollEnd={(ev) => {
                const newIndex = Math.round(ev.nativeEvent.contentOffset.x / width);
                setActiveSlide(Math.max(0, Math.min(newIndex, (heroSeries || HERO_SLIDES).length - 1)));
              }}
            />
          )}
          
          {/* Pagination Dots */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12, gap: 6 }}>
            {((heroSeries && heroSeries.length > 0) ? heroSeries : HERO_SLIDES).map((_: any, i: number) => (
              <View 
                key={i} 
                style={{ height: 3, borderRadius: 99, backgroundColor: i === activeSlide ? '#F97316' : '#3f3f46', width: i === activeSlide ? 20 : 6 }}
              />
            ))}
          </View>

          {/* Top Picks For You */}
          <View style={{ marginTop: 28 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 16 }}>
              <View style={{ width: 3, height: 18, backgroundColor: '#F97316', borderRadius: 99, marginRight: 10 }} />
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '800', letterSpacing: -0.5 }}>Top Picks For You</Text>
            </View>
            {topPicksLoading ? (
              <FlatList 
                data={[1, 2, 3]}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24 }}
                renderItem={() => <Skeleton className="w-36 h-52 mr-4 rounded-xl" />}
              />
            ) : (
              <FlatList 
                data={topPicks}
                renderItem={renderHorizontalStory}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={144 + 16}
                snapToAlignment="start"
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: 24, paddingRight: 24 }}
              />
            )}
          </View>

          {/* Genres Tab Bar */}
          <View style={{ marginTop: 28, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 14 }}>
              <View style={{ width: 3, height: 18, backgroundColor: '#F97316', borderRadius: 99, marginRight: 10 }} />
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '800', letterSpacing: -0.5 }}>Explore Genres</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}>
              <PressableScale
                onPress={() => setActiveGenreTab('All')}
                className={`px-5 py-2.5 rounded-full border ${activeGenreTab === 'All' ? 'bg-white border-white' : 'bg-transparent border-zinc-700'}`}
              >
                <Text className={`font-bold ${activeGenreTab === 'All' ? 'text-black' : 'text-zinc-300'}`}>All</Text>
              </PressableScale>
              {dynamicGenres.map((genre) => (
                <PressableScale
                  key={genre.id}
                  onPress={() => setActiveGenreTab(genre.name)}
                  className={`px-5 py-2.5 rounded-full border ${activeGenreTab === genre.name ? 'border-transparent' : 'bg-transparent border-zinc-700'}`}
                  style={activeGenreTab === genre.name ? { backgroundColor: genre.color } : {}}
                >
                  <Text className={`font-bold ${activeGenreTab === genre.name ? 'text-white' : 'text-zinc-300'}`}>{genre.name}</Text>
                </PressableScale>
              ))}
            </ScrollView>
          </View>

          {/* Filtered Series Grid */}
          <View className="px-6 mb-8 flex-row flex-wrap gap-[3.5%] gap-y-6">
            {allSeriesLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="w-[31%] h-40 rounded-md" />
              ))
            ) : (
              (activeGenreTab === 'All' ? allSeries : allSeries?.filter((s: any) => s.genre?.toLowerCase() === activeGenreTab.toLowerCase()))?.map((item: any) => (
                <PressableScale 
                  key={item.id}
                  onPress={() => handlePress(item.id)}
                  className="w-[31%] relative rounded-md overflow-hidden bg-noir-card border border-zinc-800"
                >
                  <Image 
                    source={{ uri: item.cover_thumb_url || item.cover_large_url || 'https://via.placeholder.com/400' }}
                    className="w-full h-40"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(17,17,17,0.9)', '#111111']}
                    className="absolute bottom-0 left-0 right-0 h-16"
                  />
                  <View className="absolute bottom-2 left-1.5 right-1.5">
                    <Text className="text-white font-bold text-[10px]" numberOfLines={2}>{item.title}</Text>
                  </View>
                </PressableScale>
              ))
            )}
            {(!allSeriesLoading && allSeries && allSeries.length > 0 && activeGenreTab !== 'All' && !allSeries.some((s: any) => s.genre?.toLowerCase() === activeGenreTab.toLowerCase())) && (
              <View className="w-full items-center justify-center py-10">
                <Text className="text-zinc-500 font-medium">No series in this genre yet.</Text>
              </View>
            )}
          </View>
          <View className="h-8" />
        </View>
      )}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  shadowText: {
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  }
});
