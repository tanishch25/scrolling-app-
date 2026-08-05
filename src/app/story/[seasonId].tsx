import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS, Easing, withDelay } from 'react-native-reanimated';
import { X, Settings, Bookmark, Heart, MessageCircle, Share2, Star, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useSeasonSlides } from '../../api/slides';
import { PressableScale } from '../../components/ui/PressableScale';

const { width, height } = Dimensions.get('window');

type Theme = 'Dark' | 'Sepia' | 'Night';

export default function SlideReaderScreen() {
  const { seasonId } = useLocalSearchParams();
  const router = useRouter();
  const { slides, loading } = useSeasonSlides(seasonId as string);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showEnding, setShowEnding] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');
  const [lineSpacing, setLineSpacing] = useState<'normal' | 'relaxed'>('normal');
  const [theme, setTheme] = useState<Theme>('Dark');

  const TOTAL_SLIDES = slides.length;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const introOpacity = useSharedValue(1);
  const introScale = useSharedValue(1.1);

  useEffect(() => {
    // Comic style chapter intro animation
    introScale.value = withTiming(1, { duration: 4000, easing: Easing.out(Easing.cubic) });
    const timer = setTimeout(() => {
      introOpacity.value = withTiming(0, { duration: 800 });
      setTimeout(() => setIntroVisible(false), 800);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentIndex < TOTAL_SLIDES - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowEnding(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const swipeGesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(0.98, { damping: 20, stiffness: 200 });
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      rotation.value = (e.translationX / width) * 5;
    })
    .onEnd((e) => {
      scale.value = withSpring(1);
      
      const thresholdX = width * 0.2;
      const thresholdY = 60;
      
      if (e.translationX < -thresholdX || e.translationY < -thresholdY) {
        // Next
        translateX.value = withTiming(-width, { duration: 250 });
        translateY.value = withTiming(-height, { duration: 250 });
        runOnJS(setTimeout)(() => {
          runOnJS(handleNext)();
          translateX.value = width;
          translateY.value = height;
          rotation.value = 0;
          translateX.value = withSpring(0, { damping: 25, stiffness: 120 });
          translateY.value = withSpring(0, { damping: 25, stiffness: 120 });
        }, 250);
      } else if (e.translationX > thresholdX || e.translationY > thresholdY) {
        // Prev
        translateX.value = withTiming(width, { duration: 250 });
        translateY.value = withTiming(height, { duration: 250 });
        runOnJS(setTimeout)(() => {
          runOnJS(handlePrev)();
          translateX.value = -width;
          translateY.value = -height;
          rotation.value = 0;
          translateX.value = withSpring(0, { damping: 25, stiffness: 120 });
          translateY.value = withSpring(0, { damping: 25, stiffness: 120 });
        }, 250);
      } else {
        // Snap back
        translateX.value = withSpring(0, { damping: 20, stiffness: 150 });
        translateY.value = withSpring(0, { damping: 20, stiffness: 150 });
        rotation.value = withSpring(0, { damping: 20, stiffness: 150 });
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

  const animatedIntroStyle = useAnimatedStyle(() => ({
    opacity: introOpacity.value,
    transform: [{ scale: introScale.value }]
  }));

  if (loading) {
    return (
      <View className="flex-1 bg-noir-bg justify-center items-center">
        <Text className="text-zinc-500 font-bold tracking-widest uppercase text-xs">Loading Chapter...</Text>
      </View>
    );
  }

  if (!slides || slides.length === 0) {
    return (
      <View className="flex-1 bg-noir-bg justify-center items-center">
        <Text className="text-zinc-500 font-bold tracking-widest uppercase text-xs">No slides found.</Text>
      </View>
    );
  }

  const slide = slides[currentIndex];
  
  const themeStyles = {
    Dark: { bg: '#000000', text: '#ffffff', overlay: 'rgba(0,0,0,0.8)' },
    Sepia: { bg: '#2b2118', text: '#fcd34d', overlay: 'rgba(43,33,24,0.8)' },
    Night: { bg: '#09090b', text: '#ef4444', overlay: 'rgba(9,9,11,0.9)' },
  };

  const currentTheme = themeStyles[theme];

  return (
    <View className="flex-1 relative" style={{ backgroundColor: currentTheme.bg }}>
      <Image 
        source={{ uri: slide.background_url || slide.bgImage }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        key={currentIndex}
      />
      <LinearGradient
        colors={[currentTheme.overlay, 'transparent', currentTheme.overlay]}
        style={StyleSheet.absoluteFill}
      />

      {/* Intro Overlay */}
      {introVisible && (
        <Animated.View style={[StyleSheet.absoluteFill, animatedIntroStyle, { backgroundColor: '#000', zIndex: 100, justifyContent: 'center', alignItems: 'center' }]}>
          <Text className="text-noir-primary font-bold tracking-widest uppercase text-xs mb-4">Vol 1</Text>
          <Text className="text-white text-5xl font-extrabold tracking-tight mb-2">The Breach</Text>
          <View className="w-12 h-1 bg-noir-accent mt-4" />
        </Animated.View>
      )}

      {/* HUD */}
      {!showEnding && (
        <View className="flex-1 z-50 pt-14 pb-8 pointer-events-box-none">
          <View className="flex-row items-center px-6 mb-6 justify-between pointer-events-auto">
            <PressableScale onPress={() => router.back()} className="w-10 h-10 bg-black/40 rounded-full items-center justify-center backdrop-blur-md border border-white/10">
              <X color="white" size={24} />
            </PressableScale>
            
            <View className="flex-1 px-6">
              <View className="flex-row justify-between mb-1">
                <Text className="text-zinc-400 text-[9px] font-bold uppercase tracking-widest">Page {currentIndex + 1} of {TOTAL_SLIDES}</Text>
                <Text className="text-noir-primary text-[9px] font-bold uppercase tracking-widest">{(TOTAL_SLIDES - currentIndex) * 0.5}m left</Text>
              </View>
              <View className="w-full bg-zinc-800/80 h-1 rounded-full overflow-hidden">
                <View 
                  className="h-full bg-noir-primary" 
                  style={{ width: `${((currentIndex + 1) / TOTAL_SLIDES) * 100}%` }} 
                />
              </View>
            </View>

            <PressableScale onPress={() => setShowSettings(true)} className="w-10 h-10 bg-black/40 rounded-full items-center justify-center backdrop-blur-md border border-white/10">
              <Settings color="white" size={20} />
            </PressableScale>
          </View>
          
          {/* Content Area */}
          <GestureDetector gesture={swipeGesture}>
            <View className="flex-1 justify-center items-center px-8">
              <Animated.View style={[animatedStyle, { width: '100%' }]}>
                 <Text 
                   style={{ color: currentTheme.text }}
                   className={`font-medium text-center shadow-black drop-shadow-md 
                   ${textSize === 'large' ? 'text-4xl' : 'text-3xl'} 
                   ${lineSpacing === 'relaxed' ? 'leading-[1.8]' : 'leading-snug'}`}
                 >
                   {slide.text_content || slide.text}
                 </Text>
              </Animated.View>
            </View>
          </GestureDetector>

          <View className="absolute bottom-10 right-6 pointer-events-auto">
            <PressableScale onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }} className="w-12 h-12 bg-black/60 rounded-full items-center justify-center backdrop-blur-md border border-white/10">
              <Bookmark color="white" size={20} />
            </PressableScale>
          </View>
        </View>
      )}

      {/* Invisible Tap Zones */}
      {!showSettings && !showEnding && (
        <View className="absolute inset-0 flex-row z-40" pointerEvents="box-none">
          <GestureDetector gesture={Gesture.Tap().onEnd(() => runOnJS(handlePrev)())}>
            <View className="flex-1 h-full bg-transparent" />
          </GestureDetector>
          <GestureDetector gesture={Gesture.Tap().onEnd(() => runOnJS(handleNext)())}>
            <View className="flex-[2] h-full bg-transparent" />
          </GestureDetector>
        </View>
      )}

      {/* Ending Screen */}
      {showEnding && (
        <View className="absolute inset-0 bg-noir-bg z-[200] pt-20 px-6">
          <Text className="text-noir-primary font-bold uppercase tracking-widest text-[10px] mb-2">Volume Complete</Text>
          <Text className="text-white text-4xl font-extrabold tracking-tight mb-8">The Breach</Text>
          
          <View className="bg-noir-card border border-zinc-800 rounded-2xl p-6 mb-6">
            <Text className="text-white font-bold text-center mb-4">Rate this volume</Text>
            <View className="flex-row justify-center space-x-2">
              {[1,2,3,4,5].map((star) => (
                <PressableScale key={star} onPress={() => Haptics.selectionAsync()}>
                  <Star size={32} color={star <= 4 ? "#D4A017" : "#3f3f46"} fill={star <= 4 ? "#D4A017" : "transparent"} />
                </PressableScale>
              ))}
            </View>
          </View>

          <View className="flex-row justify-center space-x-6 mb-10">
            <PressableScale className="items-center" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
              <View className="w-14 h-14 rounded-full bg-noir-surface items-center justify-center mb-2">
                <Heart size={24} color="#F97316" fill="#F97316" />
              </View>
              <Text className="text-zinc-400 font-medium text-xs">Like</Text>
            </PressableScale>
            
            <PressableScale className="items-center">
              <View className="w-14 h-14 rounded-full bg-noir-surface items-center justify-center mb-2">
                <MessageCircle size={24} color="white" />
              </View>
              <Text className="text-zinc-400 font-medium text-xs">Comment</Text>
            </PressableScale>

            <PressableScale className="items-center">
              <View className="w-14 h-14 rounded-full bg-noir-surface items-center justify-center mb-2">
                <Share2 size={24} color="white" />
              </View>
              <Text className="text-zinc-400 font-medium text-xs">Share</Text>
            </PressableScale>
          </View>

          <PressableScale 
            onPress={() => router.back()}
            className="w-full bg-noir-primary py-4 rounded-full flex-row justify-center items-center mb-4"
          >
            <Text className="text-white font-bold text-lg mr-2">Continue Series</Text>
            <ChevronRight color="white" size={20} />
          </PressableScale>

          <PressableScale 
            onPress={() => router.back()}
            className="w-full bg-noir-surface py-4 rounded-full flex-row justify-center items-center"
          >
            <Text className="text-white font-bold text-lg">Return Home</Text>
          </PressableScale>
        </View>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <View className="absolute inset-0 bg-black/80 justify-end z-[100]" pointerEvents="auto">
          <View className="bg-noir-card w-full p-8 rounded-t-3xl border-t border-zinc-800">
             <Text className="text-white text-2xl font-bold mb-8">Reading Experience</Text>
             
             {/* Font Size */}
             <Text className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-3">Font Size</Text>
             <View className="flex-row gap-4 mb-6">
               <PressableScale onPress={() => setTextSize('normal')} className={`flex-1 py-3 rounded-xl border ${textSize === 'normal' ? 'bg-white border-white' : 'bg-noir-surface border-zinc-800'}`}>
                 <Text className={`text-center font-bold ${textSize === 'normal' ? 'text-black' : 'text-white'}`}>Normal</Text>
               </PressableScale>
               <PressableScale onPress={() => setTextSize('large')} className={`flex-1 py-3 rounded-xl border ${textSize === 'large' ? 'bg-white border-white' : 'bg-noir-surface border-zinc-800'}`}>
                 <Text className={`text-center font-bold ${textSize === 'large' ? 'text-black' : 'text-white'}`}>Large</Text>
               </PressableScale>
             </View>

             {/* Line Spacing */}
             <Text className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-3">Line Spacing</Text>
             <View className="flex-row gap-4 mb-6">
               <PressableScale onPress={() => setLineSpacing('normal')} className={`flex-1 py-3 rounded-xl border ${lineSpacing === 'normal' ? 'bg-white border-white' : 'bg-noir-surface border-zinc-800'}`}>
                 <Text className={`text-center font-bold ${lineSpacing === 'normal' ? 'text-black' : 'text-white'}`}>Normal</Text>
               </PressableScale>
               <PressableScale onPress={() => setLineSpacing('relaxed')} className={`flex-1 py-3 rounded-xl border ${lineSpacing === 'relaxed' ? 'bg-white border-white' : 'bg-noir-surface border-zinc-800'}`}>
                 <Text className={`text-center font-bold ${lineSpacing === 'relaxed' ? 'text-black' : 'text-white'}`}>Relaxed</Text>
               </PressableScale>
             </View>

             {/* Theme */}
             <Text className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-3">Theme</Text>
             <View className="flex-row gap-4 mb-10">
               {(['Dark', 'Sepia', 'Night'] as Theme[]).map((t) => (
                 <PressableScale key={t} onPress={() => setTheme(t)} className={`flex-1 py-3 rounded-xl border ${theme === t ? 'bg-white border-white' : 'bg-noir-surface border-zinc-800'}`}>
                   <Text className={`text-center font-bold ${theme === t ? 'text-black' : 'text-white'}`}>{t}</Text>
                 </PressableScale>
               ))}
             </View>

             <PressableScale onPress={() => setShowSettings(false)} className="w-full bg-noir-primary py-4 rounded-full">
               <Text className="text-center font-bold text-lg text-white">Done</Text>
             </PressableScale>
          </View>
        </View>
      )}
    </View>
  );
}
