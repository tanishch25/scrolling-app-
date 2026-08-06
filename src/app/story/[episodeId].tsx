import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { X } from 'lucide-react-native';
import { PressableScale } from '../../components/ui/PressableScale';
import { useEpisodeDetails } from '../../hooks/useQueries';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function EpisodePlayerScreen() {
  const { episodeId } = useLocalSearchParams<{ episodeId: string }>();
  const router = useRouter();
  
  const { data: episode, isLoading } = useEpisodeDetails(episodeId);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  // We only initialize the player if we have the URL
  const player = useVideoPlayer(episode?.video_url || null, player => {
    player.loop = false;
    player.play();
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" hidden />
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  if (!episode) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" hidden />
        <Text style={{ color: 'white' }}>Episode not found</Text>
        <PressableScale onPress={() => router.back()} style={{ marginTop: 20, padding: 10, backgroundColor: '#27272a', borderRadius: 8 }}>
          <Text style={{ color: 'white' }}>Go Back</Text>
        </PressableScale>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden />
      
      {episode.video_url ? (
        <VideoView 
          style={StyleSheet.absoluteFill} 
          player={player}
          nativeControls={true}
          allowsPictureInPicture
        />
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={{ color: 'red' }}>Error: No video URL provided for this episode.</Text>
        </View>
      )}

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
  }
});
