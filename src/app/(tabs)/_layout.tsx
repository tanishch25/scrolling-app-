import { Tabs } from 'expo-router';
import { Home, User, Search, PlaySquare } from 'lucide-react-native';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const TabIcon = ({ focused, Icon, label }: { focused: boolean; Icon: any; label: string }) => {
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(focused ? 1.2 : 1, { damping: 12, stiffness: 200 }) }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: withTiming(focused ? 1 : 0.6, { duration: 200 }),
    transform: [{ translateY: withSpring(focused ? 0 : 2, { damping: 15, stiffness: 200 }) }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(focused ? 1 : 0, { duration: 300 }),
    transform: [{ scale: withSpring(focused ? 1 : 0, { damping: 15, stiffness: 200 }) }]
  }));

  return (
    <View className="items-center justify-center flex-1 py-2">
      <Animated.View style={glowStyle} className="absolute w-8 h-8 rounded-full bg-noir-primary/20" />
      <Animated.View style={animatedIconStyle}>
        <Icon size={24} color={focused ? '#F97316' : '#A1A1AA'} strokeWidth={focused ? 2.5 : 2} />
      </Animated.View>
      <Animated.Text 
        className="text-[10px] mt-1 font-medium" 
        style={[{ color: focused ? '#F97316' : '#A1A1AA' }, animatedTextStyle]}
      >
        {label}
      </Animated.Text>
    </View>
  );
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'ios' ? insets.bottom : insets.bottom + 10;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          elevation: 0,
          borderTopWidth: 0,
          height: 60 + bottomInset,
        },
        tabBarBackground: () => (
          <BlurView 
            tint="dark" 
            intensity={80} 
            style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' }]} 
          />
        ),
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={Home} label="Home" />,
        }}
      />
      <Tabs.Screen
        name="spotlight"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={PlaySquare} label="Spotlight" />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={Search} label="Explore" />,
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={User} label="My" />,
        }}
      />
    </Tabs>
  );
}
