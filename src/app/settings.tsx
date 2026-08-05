import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, Moon, Crown, LogOut, CreditCard, Shield, HelpCircle, ChevronRight, Check } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { PressableScale } from '../components/ui/PressableScale';

export default function SettingsScreen() {
  const router = useRouter();
  
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [appearance, setAppearance] = useState<'Dark' | 'True Black' | 'System'>('True Black');

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: () => router.replace('/') }
      ]
    );
  };

  return (
    <View className="flex-1 bg-noir-bg pt-14">
      <StatusBar style="light" />
      
      {/* Header */}
      <View className="px-6 flex-row items-center mb-6">
        <PressableScale onPress={() => router.back()} className="w-10 h-10 bg-noir-surface rounded-full items-center justify-center border border-zinc-800">
          <ChevronLeft color="white" size={24} />
        </PressableScale>
        <Text className="text-white text-2xl font-extrabold ml-4">Settings</Text>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Account Status */}
        <Text className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-3">Account</Text>
        <View className="bg-noir-card border border-zinc-800 rounded-2xl p-5 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Crown size={20} color="#D4A017" />
              <Text className="text-white font-bold ml-3 text-base">Premium Member</Text>
            </View>
            <View className="bg-noir-accent/20 px-2.5 py-1 rounded">
              <Text className="text-noir-accent font-bold uppercase tracking-widest text-[10px]">Active</Text>
            </View>
          </View>
          <View className="w-full h-[1px] bg-zinc-800/50 mb-4" />
          <PressableScale className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <CreditCard size={18} color="#A1A1AA" />
              <Text className="text-zinc-300 font-medium ml-3">Manage Subscription</Text>
            </View>
            <ChevronRight color="#52525b" size={16} />
          </PressableScale>
        </View>

        {/* Preferences */}
        <Text className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-3">Preferences</Text>
        <View className="bg-noir-card border border-zinc-800 rounded-2xl overflow-hidden mb-8">
          {/* Notifications */}
          <View className="p-5 border-b border-zinc-800/50 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Bell size={20} color="#A1A1AA" />
              <View className="ml-3">
                <Text className="text-white font-bold text-base">Push Notifications</Text>
                <Text className="text-zinc-500 text-xs mt-0.5">New episodes and recommendations</Text>
              </View>
            </View>
            <Switch 
              value={pushEnabled} 
              onValueChange={setPushEnabled}
              trackColor={{ false: '#27272a', true: '#F97316' }}
              thumbColor="#ffffff"
            />
          </View>

          <View className="p-5 border-b border-zinc-800/50 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Bell size={20} color="#A1A1AA" />
              <View className="ml-3">
                <Text className="text-white font-bold text-base">Email Updates</Text>
                <Text className="text-zinc-500 text-xs mt-0.5">Newsletters and promotions</Text>
              </View>
            </View>
            <Switch 
              value={emailEnabled} 
              onValueChange={setEmailEnabled}
              trackColor={{ false: '#27272a', true: '#F97316' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Appearance */}
          <View className="p-5">
            <View className="flex-row items-center mb-4">
              <Moon size={20} color="#A1A1AA" />
              <Text className="text-white font-bold ml-3 text-base">Appearance</Text>
            </View>
            <View className="flex-row bg-noir-bg rounded-xl p-1 border border-zinc-800">
              {(['Dark', 'True Black', 'System'] as const).map(mode => (
                <PressableScale 
                  key={mode} 
                  onPress={() => setAppearance(mode)}
                  className={`flex-1 py-2.5 rounded-lg flex-row items-center justify-center ${appearance === mode ? 'bg-zinc-800' : 'bg-transparent'}`}
                >
                  {appearance === mode && <Check size={12} color="#ffffff" className="mr-1.5" />}
                  <Text className={`font-bold text-xs ${appearance === mode ? 'text-white' : 'text-zinc-500'}`}>{mode}</Text>
                </PressableScale>
              ))}
            </View>
          </View>
        </View>

        {/* Support */}
        <Text className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-3">Support</Text>
        <View className="bg-noir-card border border-zinc-800 rounded-2xl overflow-hidden mb-10">
          <PressableScale className="p-5 border-b border-zinc-800/50 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <HelpCircle size={20} color="#A1A1AA" />
              <Text className="text-white font-bold ml-3 text-base">Help Center</Text>
            </View>
            <ChevronRight color="#52525b" size={16} />
          </PressableScale>
          <PressableScale className="p-5 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Shield size={20} color="#A1A1AA" />
              <Text className="text-white font-bold ml-3 text-base">Privacy Policy</Text>
            </View>
            <ChevronRight color="#52525b" size={16} />
          </PressableScale>
        </View>

        {/* Logout */}
        <PressableScale 
          onPress={handleLogout}
          className="w-full bg-red-900/10 border border-red-900/30 py-4 rounded-xl flex-row items-center justify-center mb-8"
        >
          <LogOut size={20} color="#ef4444" />
          <Text className="text-red-500 font-bold text-base ml-2">Sign Out</Text>
        </PressableScale>

        <Text className="text-zinc-600 text-center text-xs mb-8">Comic Noir v2.0.0</Text>
        
      </ScrollView>
    </View>
  );
}
