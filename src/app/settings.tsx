import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, Moon, Crown, LogOut, CreditCard, Shield, HelpCircle, ChevronRight, Check } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { PressableScale } from '../components/ui/PressableScale';
import { useAuth } from '../context/AuthContext';
import { usePushNotifications } from '../hooks/usePushNotifications';

export default function SettingsScreen() {
  const router = useRouter();
  const { isGuest } = useAuth();
  const { requestPermissions } = usePushNotifications();
  
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  useEffect(() => {
    // Load preferences
    const loadPrefs = async () => {
      try {
        const push = await AsyncStorage.getItem('pref_push');
        const email = await AsyncStorage.getItem('pref_email');
        
        if (push !== null) setPushEnabled(push === 'true');
        if (email !== null) setEmailEnabled(email === 'true');
      } catch (e) {}
    };
    loadPrefs();
  }, []);

  const handlePushChange = async (val: boolean) => {
    setPushEnabled(val);
    await AsyncStorage.setItem('pref_push', String(val));
    if (val) {
      await requestPermissions();
    }
  };

  const handleEmailChange = async (val: boolean) => {
    setEmailEnabled(val);
    await AsyncStorage.setItem('pref_email', String(val));
  };

  const handleLogout = () => {
    if (isGuest) {
      router.replace('/(auth)/login');
      return;
    }
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive", 
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/(auth)/login');
          }
        }
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
              <Crown size={20} color={isGuest ? "#52525b" : "#D4A017"} />
              <Text className={`font-bold ml-3 text-base ${isGuest ? 'text-zinc-500' : 'text-white'}`}>Premium Member</Text>
            </View>
            <View className={`${isGuest ? 'bg-zinc-800/50 border border-zinc-700/50' : 'bg-noir-accent/20'} px-2.5 py-1 rounded`}>
              <Text className={`${isGuest ? 'text-zinc-500' : 'text-noir-accent'} font-bold uppercase tracking-widest text-[10px]`}>{isGuest ? 'Inactive' : 'Active'}</Text>
            </View>
          </View>
          <View className="w-full h-[1px] bg-zinc-800/50 mb-4" />
          <PressableScale className="flex-row items-center justify-between" disabled={isGuest}>
            <View className="flex-row items-center">
              <CreditCard size={18} color="#A1A1AA" />
              <Text className={`${isGuest ? 'text-zinc-600' : 'text-zinc-300'} font-medium ml-3`}>Manage Subscription</Text>
            </View>
            <ChevronRight color={isGuest ? "#27272a" : "#52525b"} size={16} />
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
              onValueChange={handlePushChange}
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
              onValueChange={handleEmailChange}
              trackColor={{ false: '#27272a', true: '#F97316' }}
              thumbColor="#ffffff"
            />
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

        {/* Logout / Login */}
        <PressableScale 
          onPress={handleLogout}
          className={`w-full py-4 rounded-xl flex-row items-center justify-center mb-8 ${isGuest ? 'bg-blue-900/10 border-blue-900/30' : 'bg-red-900/10 border-red-900/30'} border`}
        >
          <LogOut size={20} color={isGuest ? "#3b82f6" : "#ef4444"} />
          <Text className={`font-bold text-base ml-2 ${isGuest ? 'text-blue-500' : 'text-red-500'}`}>
            {isGuest ? 'Log In or Sign Up' : 'Sign Out'}
          </Text>
        </PressableScale>

        <Text className="text-zinc-600 text-center text-xs mb-8">Comic Noir v2.0.0</Text>
        
      </ScrollView>
    </View>
  );
}

