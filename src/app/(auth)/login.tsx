import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet, Image } from 'react-native';
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
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
      style={{ flex: 1, backgroundColor: '#000000' }}
    >
      <StatusBar style="light" />

      {/* Subtle top glow */}
      <LinearGradient
        colors={['rgba(249,115,22,0.12)', 'transparent']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 300 }}
      />

      <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: 'center' }}>
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Image
            source={require('../../../assets/images/icon.png')}
            style={{ width: 56, height: 56, borderRadius: 14, marginBottom: 20 }}
          />
          <Text style={{ color: 'white', fontSize: 36, fontWeight: '900', letterSpacing: -1.5, marginBottom: 6 }}>
            Welcome back.
          </Text>
          <Text style={{ color: '#71717a', fontSize: 15, fontWeight: '500' }}>
            Sign in to continue your story.
          </Text>
        </View>

        {/* Fields */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: '#71717a', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, marginLeft: 2 }}>
            Email
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#52525B"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={{ marginBottom: 8 }}>
          <Text style={{ color: '#71717a', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, marginLeft: 2 }}>
            Password
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#52525B"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error && (
          <View style={{ backgroundColor: 'rgba(220,38,38,0.12)', borderWidth: 1, borderColor: 'rgba(220,38,38,0.3)', borderRadius: 12, padding: 12, marginBottom: 16 }}>
            <Text style={{ color: '#f87171', fontSize: 13, fontWeight: '600', textAlign: 'center' }}>{error}</Text>
          </View>
        )}

        <View style={{ marginTop: 24, gap: 12 }}>
          <PressableScale
            onPress={handleLogin}
            disabled={loading}
            style={{ height: 56, borderRadius: 99, overflow: 'hidden' }}
          >
            <LinearGradient
              colors={['#F97316', '#C2410C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              {loading
                ? <ActivityIndicator color="white" />
                : <Text style={{ color: 'white', fontWeight: '700', fontSize: 15, letterSpacing: 2, textTransform: 'uppercase' }}>Log In</Text>
              }
            </LinearGradient>
          </PressableScale>

          <PressableScale
            onPress={() => router.back()}
            style={{ height: 52, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#52525b', fontWeight: '700', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>Go Back</Text>
          </PressableScale>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#1B1B1B',
    color: 'white',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    fontSize: 15,
  },
});
