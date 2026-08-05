import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PressableScale } from '../../components/ui/PressableScale';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-noir-bg"
    >
      <StatusBar style="light" />
      <View className="flex-1 px-8 justify-center">
        <View className="mb-10">
          <Text className="text-white text-4xl font-black tracking-tighter mb-2">Welcome back.</Text>
          <Text className="text-zinc-400 font-medium text-base">Sign in to continue your story.</Text>
        </View>

        <View className="space-y-4 mb-8">
          <View>
            <Text className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Email</Text>
            <TextInput
              className="bg-noir-surface text-white px-5 py-4 rounded-xl border border-zinc-800 focus:border-noir-primary"
              placeholder="Enter your email"
              placeholderTextColor="#52525B"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <Text className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Password</Text>
            <TextInput
              className="bg-noir-surface text-white px-5 py-4 rounded-xl border border-zinc-800 focus:border-noir-primary"
              placeholder="Enter your password"
              placeholderTextColor="#52525B"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        {error && (
          <Text className="text-red-500 text-sm font-medium mb-6 text-center">{error}</Text>
        )}

        <View className="space-y-4">
          <PressableScale 
            onPress={handleLogin}
            disabled={loading}
            className="w-full rounded-full overflow-hidden"
          >
            <LinearGradient
              colors={['#F97316', '#C2410C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="py-4 items-center justify-center border-t border-[#FF9852]"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base tracking-widest uppercase">Log In</Text>
              )}
            </LinearGradient>
          </PressableScale>

          <PressableScale onPress={() => router.back()} className="py-4 items-center justify-center">
            <Text className="text-zinc-500 font-bold text-sm tracking-widest uppercase">Go Back</Text>
          </PressableScale>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
