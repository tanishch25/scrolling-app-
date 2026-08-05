import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { session, loading, isGuest } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  // If user is logged in or explicitly signed in as guest, go to tabs
  if (session || isGuest) {
    return <Redirect href="/(tabs)/home" />;
  }

  // Otherwise force them to auth screen
  return <Redirect href="/(auth)/welcome" />;
}
