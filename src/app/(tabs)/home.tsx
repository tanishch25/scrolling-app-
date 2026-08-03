import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTrendingStories, useNewReleases } from '../../api/stories';

const { width } = Dimensions.get('window');

const NEW_RELEASES = [
  { id: '7', title: 'Cyber Punk', genre: 'Action', img: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=400&auto=format&fit=crop' },
  { id: '8', title: 'Silent Night', genre: 'Mystery', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&auto=format&fit=crop' },
  { id: '9', title: 'Fallen Angel', genre: 'Fantasy', img: 'https://images.unsplash.com/photo-1517409226500-264627dc4bbf?q=80&w=400&auto=format&fit=crop' },
  { id: '10', title: 'City of Glass', genre: 'Drama', img: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=400&auto=format&fit=crop' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { stories: trendingStories, loading: trendingLoading } = useTrendingStories();
  const { stories: newReleases, loading: newReleasesLoading } = useNewReleases();

  const handlePress = (id: string) => {
    router.push(`/story/details/${id}`);
  };

  return (
    <ScrollView className="flex-1 bg-[#09090b]" bounces={false} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Hero Section */}
      <View style={{ width, height: 450 }} className="relative">
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1618519764620-7403abdbdf9c?q=80&w=800&auto=format&fit=crop' }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(9,9,11,0.8)', '#09090b']}
          style={StyleSheet.absoluteFill}
          locations={[0.3, 0.7, 1]}
        />
        
        <View className="absolute bottom-6 left-0 right-0 items-center px-4">
          <Text className="text-zinc-300 text-xs font-bold tracking-[0.2em] uppercase mb-2 text-center">
            Sci-Fi • Interactive
          </Text>
          
          <Text className="text-white text-5xl font-black tracking-tighter text-center mb-6" style={styles.shadowText}>
            Cyber Heist
          </Text>
          
          <View className="flex-row items-center w-full justify-center gap-4">
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => handlePress('1')}
              className="bg-white px-6 py-3 rounded-full flex-row items-center justify-center flex-1 max-w-[160px]"
            >
              <Play size={20} color="black" fill="black" />
              <Text className="text-black font-bold ml-2 text-lg uppercase">Play</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              activeOpacity={0.8}
              className="bg-zinc-800 px-6 py-3 rounded-full flex-row items-center justify-center flex-1 max-w-[160px]"
            >
              <Info size={20} color="white" />
              <Text className="text-white font-bold ml-2 text-lg uppercase">Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Continue Reading Row */}
      <View className="mt-4 pl-4">
        <Text className="text-white text-xl font-bold mb-4 uppercase tracking-tight">Continue Reading</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => handlePress('1')}
            className="w-40 h-56 mr-4 relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800"
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1618519764620-7403abdbdf9c?q=80&w=400&auto=format&fit=crop' }}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.9)']}
              style={StyleSheet.absoluteFill}
            />
            <View className="absolute bottom-0 left-0 right-0 p-3">
               <Text className="text-white font-bold text-sm uppercase">Cyber Heist</Text>
               <View className="w-full bg-zinc-800 h-1 mt-2 rounded-full overflow-hidden">
                 <View className="bg-white h-full w-1/3" />
               </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Trending Row */}
      <View className="mt-8 pl-4">
        <Text className="text-white text-xl font-bold mb-4 uppercase tracking-tight">Trending Now</Text>
        {trendingLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trendingStories.map((story) => (
              <TouchableOpacity 
                key={story.id}
                activeOpacity={0.8}
                onPress={() => handlePress(story.id)}
                className="w-32 h-48 mr-4 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-800"
              >
                <Image 
                  source={{ uri: story.cover_url || story.img }}
                  style={StyleSheet.absoluteFill}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={StyleSheet.absoluteFill}
                />
                <View className="absolute bottom-2 left-2 right-2">
                   <Text className="text-white font-bold text-xs uppercase" numberOfLines={2}>{story.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* New Releases Row */}
      <View className="mt-8 pl-4 mb-8">
        <Text className="text-white text-xl font-bold mb-4 uppercase tracking-tight">New Releases</Text>
        {newReleasesLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {newReleases.map((story) => (
              <TouchableOpacity 
                key={story.id}
                activeOpacity={0.8}
                onPress={() => handlePress(story.id)}
                className="w-40 h-56 mr-4 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-800"
              >
                <Image 
                  source={{ uri: story.cover_url || story.img }}
                  style={StyleSheet.absoluteFill}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={StyleSheet.absoluteFill}
                />
                <View className="absolute bottom-2 left-2 right-2">
                   <Text className="text-white font-bold text-sm uppercase" numberOfLines={2}>{story.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  shadowText: {
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  }
});
