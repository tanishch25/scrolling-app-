import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

export function VotingModal({ visible, onVote }: { visible: boolean, onVote: (vote: 'CONTINUE' | 'END') => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.85)' }]} className="justify-center items-center p-6">
        <View className="bg-[#09090b] w-full rounded-3xl p-8 items-center border border-zinc-800">
          <Text className="text-white text-3xl font-bold text-center mb-3">Season Finale</Text>
          <Text className="text-zinc-400 text-center mb-10 text-base leading-relaxed">
            You&apos;ve reached the end of the season. Your vote determines the fate of the story.
          </Text>

          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => onVote('CONTINUE')}
            className="w-full bg-white py-4 rounded-full mb-4"
          >
            <Text className="text-center font-bold text-lg text-black">Keep it going</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => onVote('END')}
            className="w-full bg-zinc-900 py-4 rounded-full border border-zinc-800"
          >
            <Text className="text-center font-bold text-lg text-white">End the story</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

