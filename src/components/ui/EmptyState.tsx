import React from 'react';
import { View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, message, action }: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center p-8 bg-noir-bg">
      <View className="w-24 h-24 rounded-full bg-noir-surface items-center justify-center mb-6">
        <Icon size={40} color="#F97316" strokeWidth={1.5} />
      </View>
      <Text className="text-white font-bold text-2xl mb-3 text-center">{title}</Text>
      <Text className="text-zinc-400 font-regular text-base text-center mb-8">{message}</Text>
      {action && <View>{action}</View>}
    </View>
  );
}
