import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Settings, Bookmark, History, Heart, ChevronRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const MENU_ITEMS = [
  { icon: Bookmark, label: 'Saved Stories', count: '12' },
  { icon: History, label: 'Reading History', count: '45' },
  { icon: Heart, label: 'Liked Content', count: '8' },
];

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-[#09090b]">
      <StatusBar style="light" />
      
      <ScrollView className="flex-1" bounces={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header Section with Image */}
        <View className="h-64 relative w-full">
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop' }} 
            className="w-full h-full"
          />
          <LinearGradient
            colors={['transparent', '#09090b']}
            style={StyleSheet.absoluteFill}
          />
          <View className="absolute bottom-0 left-0 right-0 p-6 flex-row items-end justify-between">
            <View>
              <Text className="text-white text-4xl font-black tracking-tighter" style={styles.shadowText}>Alex Reader</Text>
              <Text className="text-zinc-400 font-bold uppercase tracking-widest text-xs mt-1">Free Tier</Text>
            </View>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => Alert.alert("Settings", "Opening account settings...")}
              className="bg-white/20 p-3 rounded-full backdrop-blur-md border border-white/10"
            >
              <Settings color="white" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4 mt-6">
          <View className="flex-row bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 justify-between">
            <View className="items-center">
              <Text className="text-white text-3xl font-black">12</Text>
              <Text className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-1">Stories</Text>
            </View>
            <View className="w-[1px] bg-zinc-800" />
            <View className="items-center">
              <Text className="text-white text-3xl font-black">4K</Text>
              <Text className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-1">Pages</Text>
            </View>
            <View className="w-[1px] bg-zinc-800" />
            <View className="items-center">
              <Text className="text-white text-3xl font-black">15</Text>
              <Text className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-1">Days Streak</Text>
            </View>
          </View>

          <Text className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-4">Your Library</Text>
          
          <View className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            {MENU_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity 
                  key={index}
                  activeOpacity={0.7}
                  onPress={() => Alert.alert(item.label, `Opening your ${item.label}...`)}
                  className={`flex-row items-center justify-between p-5 ${
                    index !== MENU_ITEMS.length - 1 ? 'border-b border-zinc-800' : ''
                  }`}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-zinc-800 items-center justify-center mr-4">
                      <Icon color="#fff" size={20} />
                    </View>
                    <Text className="text-white font-bold text-base">{item.label}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-zinc-500 font-bold mr-3">{item.count}</Text>
                    <ChevronRight color="#71717a" size={20} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text className="text-zinc-400 font-bold uppercase tracking-widest text-xs mt-8 mb-4">Preferences</Text>
          
          <View className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-8">
            <TouchableOpacity activeOpacity={0.7} onPress={() => Alert.alert("Dark Mode", "Theme settings toggled")} className="flex-row items-center justify-between p-5 border-b border-zinc-800">
              <Text className="text-white font-bold text-base">Dark Mode</Text>
              <View className="w-12 h-6 bg-red-600 rounded-full justify-center px-1">
                <View className="w-4 h-4 bg-white rounded-full self-end" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => Alert.alert("Notifications", "Push notifications updated")} className="flex-row items-center justify-between p-5 border-b border-zinc-800">
              <Text className="text-white font-bold text-base">Push Notifications</Text>
              <ChevronRight color="#71717a" size={20} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => Alert.alert("Subscription", "Manage billing")} className="flex-row items-center justify-between p-5">
              <Text className="text-white font-bold text-base">Manage Subscription</Text>
              <ChevronRight color="#71717a" size={20} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={() => Alert.alert("Sign Out", "Logging out...")}
            className="w-full bg-zinc-900 border border-red-900/50 py-4 rounded-xl mb-8 items-center"
          >
            <Text className="text-red-500 font-bold text-base">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowText: {
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  }
});
