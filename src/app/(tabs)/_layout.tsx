import { Tabs } from 'expo-router';
import { Home, Search, Film, User, PlusSquare } from 'lucide-react-native';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const TabIcon = ({ focused, Icon, label }: { focused: boolean; Icon: any; label: string }) => {
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(focused ? 1.05 : 1, { damping: 12, stiffness: 200 }) }],
  }));

  const coverStyle = useAnimatedStyle(() => ({
    opacity: withTiming(focused ? 1 : 0, { duration: 200 }),
    transform: [{ scale: withSpring(focused ? 1 : 0.6, { damping: 15, stiffness: 200 }) }]
  }));

  // Restore orange touch
  const iconColor = focused ? '#F97316' : '#71717A'; // zinc-500 for inactive
  const fillColor = focused ? '#F97316' : 'transparent';
  
  // Search icon looks weird when fully filled, so we just use thicker stroke for it, but others get filled
  const isSearch = label === 'Explore';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[coverStyle, { position: 'absolute', width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(249, 115, 22, 0.1)' }]} />
      <Animated.View style={animatedIconStyle}>
        <Icon 
          size={24} 
          color={iconColor} 
          fill={isSearch ? 'transparent' : fillColor} 
          strokeWidth={focused ? (isSearch ? 2.5 : 2) : 2} 
        />
      </Animated.View>
    </View>
  );
};

function CustomTabBar({ state, descriptors, navigation, insets }: any) {
  const bottomInset = Platform.OS === 'ios' ? insets.bottom : insets.bottom + 10;

  return (
    <View 
      style={{ 
        position: 'absolute', 
        bottom: bottomInset > 0 ? bottomInset + 8 : 24, 
        left: 32, 
        right: 32, 
        height: 60, 
        borderRadius: 30, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1, 
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden'
      }}
    >
      <BlurView tint="dark" intensity={90} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.85)' }]} />
      
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        let Icon = Home;
        let label = 'Home';
        if (route.name === 'explore') { Icon = Search; label = 'Explore'; }
        if (route.name === 'spotlight') { Icon = Film; label = 'Spotlight'; }
        if (route.name === 'my') { Icon = User; label = 'My'; }

        return (
          <Pressable
            key={index}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }}
          >
            <TabIcon focused={isFocused} Icon={Icon} label={label} />
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} insets={insets} />}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="spotlight" />
      <Tabs.Screen name="my" />
    </Tabs>
  );
}

