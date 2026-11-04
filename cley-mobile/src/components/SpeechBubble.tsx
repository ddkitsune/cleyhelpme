import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { SpeechService } from '../services/speech';
import { HapticService } from '../services/haptics';

interface Props {
  text: string;
  autoSpeak?: boolean;
}

export const SpeechBubble: React.FC<Props> = ({ text, autoSpeak = false }) => {
  const [speaking, setSpeaking] = useState(false);

  React.useEffect(() => {
    if (autoSpeak) {
      handleSpeak();
    }
    return () => {
      SpeechService.stop();
    };
  }, [text]);

  const handleSpeak = () => {
    HapticService.light();
    if (speaking) {
      SpeechService.stop();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      SpeechService.speak(text, () => {
        setSpeaking(false);
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <TouchableOpacity
        style={[styles.audioButton, speaking && styles.audioButtonActive]}
        onPress={handleSpeak}
        accessibilityRole="button"
        accessibilityLabel="Escuchar explicación en voz alta"
      >
        <Ionicons
          name={speaking ? "pause-circle" : "volume-high"}
          size={32}
          color={speaking ? THEME.colors.success : THEME.colors.primary}
        />
        <Text style={styles.audioLabel}>
          {speaking ? "Pausar voz" : "Escuchar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    width: '100%',
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: THEME.colors.border,
    padding: 18,
    elevation: 2,
    shadowColor: THEME.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    fontSize: THEME.typography.bodyLarge,
    color: THEME.colors.textPrimary,
    lineHeight: 28,
    fontWeight: '500',
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: THEME.colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginTop: 8,
    minHeight: 48,
  },
  audioButtonActive: {
    backgroundColor: THEME.colors.successLight,
  },
  audioLabel: {
    marginLeft: 8,
    fontSize: THEME.typography.label,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
});

