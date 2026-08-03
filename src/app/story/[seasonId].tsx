import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { X } from 'lucide-react-native';
import { VotingModal } from '../../components/VotingModal';
import { LinearGradient } from 'expo-linear-gradient';

import { useSeasonSlides } from '../../api/slides';

export default function SlideReaderScreen() {
  const { seasonId } = useLocalSearchParams();
  const router = useRouter();
  const { slides, loading } = useSeasonSlides(seasonId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVoting, setShowVoting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');

  const TOTAL_SLIDES = slides.length;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleNext = () => {
    if (currentIndex < TOTAL_SLIDES - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowVoting(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const swipeGesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(0.95, { damping: 20, stiffness: 200 });
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      rotation.value = (e.translationX / Dimensions.get('window').width) * 15;
    })
    .onEnd((e) => {
      scale.value = withSpring(1);
      
      const thresholdX = Dimensions.get('window').width * 0.25;
      const thresholdY = 80;
      
      if (e.translationX < -thresholdX || e.translationY < -thresholdY) {
        // Swipe Left or Up (Next)
        translateX.value = withTiming(-Dimensions.get('window').width, { duration: 200 });
        translateY.value = withTiming(-Dimensions.get('window').height, { duration: 200 });
        runOnJS(setTimeout)(() => {
          runOnJS(handleNext)();
          translateX.value = Dimensions.get('window').width;
          translateY.value = Dimensions.get('window').height;
          rotation.value = 0;
          translateX.value = withSpring(0, { damping: 20, stiffness: 90 });
          translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
        }, 200);
      } else if (e.translationX > thresholdX || e.translationY > thresholdY) {
        // Swipe Right or Down (Prev)
        translateX.value = withTiming(Dimensions.get('window').width, { duration: 200 });
        translateY.value = withTiming(Dimensions.get('window').height, { duration: 200 });
        runOnJS(setTimeout)(() => {
          runOnJS(handlePrev)();
          translateX.value = -Dimensions.get('window').width;
          translateY.value = -Dimensions.get('window').height;
          rotation.value = 0;
          translateX.value = withSpring(0, { damping: 20, stiffness: 90 });
          translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
        }, 200);
      } else {
        // Snap back
        translateX.value = withSpring(0, { damping: 20, stiffness: 90 });
        translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
        rotation.value = withSpring(0, { damping: 20, stiffness: 90 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotateZ: `${rotation.value}deg` },
      { scale: scale.value }
    ]
  }));

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white font-bold">Loading slides...</Text>
      </View>
    );
  }

  if (!slides || slides.length === 0) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white font-bold">No slides found.</Text>
      </View>
    );
  }

  const slide = slides[currentIndex];

  const handleVote = (vote: 'CONTINUE' | 'END') => {
    setShowVoting(false);
    Alert.alert('Vote Recorded!', `You voted to ${vote === 'CONTINUE' ? 'continue' : 'end'} the story.`);
    router.back();
  };

  return (
    <View className="flex-1 bg-black relative">
      <Image 
        source={{ uri: slide.background_url || slide.bgImage }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        key={currentIndex}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.9)']}
        style={StyleSheet.absoluteFill}
      />

      <View className="flex-1 z-50 pt-12 pb-8">
        {/* Progress Bar */}
        <View className="flex-row items-center px-4">
          <View className="flex-1 bg-white/20 h-1 rounded-full overflow-hidden">
            <View 
              className="h-full bg-red-600 rounded-full" 
              style={{ width: `${((currentIndex + 1) / TOTAL_SLIDES) * 100}%` }} 
            />
          </View>
        </View>

        {/* Header */}
        <View className="flex-row items-center justify-between px-4 mt-6 relative z-50 pointer-events-auto">
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()} className="p-3 bg-black/60 rounded-full">
            <X color="white" size={24} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setShowSettings(true)} className="px-4 py-2 bg-black/60 rounded-full">
            <Text className="text-white font-bold text-xs uppercase tracking-widest">Settings</Text>
          </TouchableOpacity>
        </View>
        
        {/* Content Area */}
        <GestureDetector gesture={swipeGesture}>
          <View className="flex-1 justify-center items-center px-8">
            <Animated.View style={[animatedStyle, { width: '100%' }]}>
               <Text className={`font-semibold text-white leading-relaxed tracking-wide text-center shadow-black drop-shadow-md ${textSize === 'large' ? 'text-4xl' : 'text-3xl'}`}>
                 {slide.text_content || slide.text}
               </Text>
            </Animated.View>
          </View>
        </GestureDetector>
      </View>

      {/* Invisible Tap Zones for Navigation */}
      <View className="absolute inset-0 flex-row z-40" pointerEvents="box-none">
        <GestureDetector gesture={Gesture.Tap().onEnd(() => runOnJS(handlePrev)())}>
          <View className="flex-1 h-full bg-transparent" />
        </GestureDetector>
        <GestureDetector gesture={Gesture.Tap().onEnd(() => runOnJS(handleNext)())}>
          <View className="flex-[2] h-full bg-transparent" />
        </GestureDetector>
      </View>

      <VotingModal visible={showVoting} onVote={handleVote} />

      {/* Settings Modal */}
      {showSettings && (
        <View className="absolute inset-0 bg-black/80 justify-center items-center p-6 z-[100]" pointerEvents="auto">
          <View className="bg-zinc-900 w-full p-8 rounded-2xl border border-zinc-800">
             <Text className="text-white text-2xl font-bold mb-6">Reader Settings</Text>
             
             <Text className="text-zinc-400 font-bold uppercase text-xs mb-3">Text Size</Text>
             <View className="flex-row gap-4 mb-8">
               <TouchableOpacity 
                 onPress={() => setTextSize('normal')}
                 className={`flex-1 py-3 rounded-xl border ${textSize === 'normal' ? 'bg-white border-white' : 'bg-zinc-800 border-zinc-700'}`}
               >
                 <Text className={`text-center font-bold ${textSize === 'normal' ? 'text-black' : 'text-white'}`}>Normal</Text>
               </TouchableOpacity>
               <TouchableOpacity 
                 onPress={() => setTextSize('large')}
                 className={`flex-1 py-3 rounded-xl border ${textSize === 'large' ? 'bg-white border-white' : 'bg-zinc-800 border-zinc-700'}`}
               >
                 <Text className={`text-center font-bold ${textSize === 'large' ? 'text-black' : 'text-white'}`}>Large</Text>
               </TouchableOpacity>
             </View>

             <TouchableOpacity 
               activeOpacity={0.8}
               onPress={() => setShowSettings(false)}
               className="w-full bg-white py-4 rounded-full"
             >
               <Text className="text-center font-bold text-lg text-black">Done</Text>
             </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
