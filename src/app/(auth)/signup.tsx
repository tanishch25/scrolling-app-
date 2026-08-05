import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PressableScale } from '../../components/ui/PressableScale';
import { supabase } from '../../lib/supabase';

export default function SignupScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !username) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          }
        }
      });

      if (error) throw error;
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 32, paddingVertical: 40 }}>
        <View className="mb-10">
          <Text className="text-white text-4xl font-black tracking-tighter mb-2">Create Account.</Text>
          <Text className="text-zinc-400 font-medium text-base">Join the cinematic revolution.</Text>
        </View>

        {success ? (
          <View className="bg-green-900/20 border border-green-500/50 p-6 rounded-2xl mb-8 items-center">
            <Text className="text-white text-lg font-bold mb-2">Check your email!</Text>
            <Text className="text-zinc-300 text-center text-sm">We sent a confirmation link to {email}. Please click it to verify your account before logging in.</Text>
            <PressableScale onPress={() => router.replace('/(auth)/login')} className="mt-6">
              <Text className="text-noir-primary font-bold tracking-widest uppercase">Go to Login</Text>
            </PressableScale>
          </View>
        ) : (
          <>
            <View className="space-y-4 mb-8">
              <View>
                <Text className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Username</Text>
                <TextInput
                  className="bg-noir-surface text-white px-5 py-4 rounded-xl border border-zinc-800 focus:border-noir-primary"
                  placeholder="Choose a username"
                  placeholderTextColor="#52525B"
                  autoCapitalize="none"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>

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
                  placeholder="Create a strong password"
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
                onPress={handleSignup}
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
                    <Text className="text-white font-bold text-base tracking-widest uppercase">Sign Up</Text>
                  )}
                </LinearGradient>
              </PressableScale>

              <PressableScale onPress={() => router.back()} className="py-4 items-center justify-center">
                <Text className="text-zinc-500 font-bold text-sm tracking-widest uppercase">Go Back</Text>
              </PressableScale>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
