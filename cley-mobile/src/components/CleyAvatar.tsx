import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { THEME } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  size?: number;
  mood?: 'happy' | 'listening' | 'speaking';
}

export const CleyAvatar: React.FC<Props> = ({ size = 110, mood = 'happy' }) => {
  return (
    <View style={[styles.outerRing, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.innerCircle, { width: size - 8, height: size - 8, borderRadius: (size - 8) / 2 }]}>
        <Ionicons name="person" size={size * 0.55} color={THEME.colors.primary} />
        {/* Lentes amigables */}
        <View style={styles.glassesRow}>
          <View style={styles.glassCircle} />
          <View style={styles.glassBridge} />
          <View style={styles.glassCircle} />
        </View>
      </View>
      {mood === 'speaking' && (
        <View style={styles.speakingBadge}>
          <Ionicons name="volume-medium" size={18} color="#FFFFFF" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerRing: {
    backgroundColor: THEME.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: THEME.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    alignSelf: 'center',
    marginVertical: 12,
  },
  innerCircle: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME.colors.primary,
  },
  glassesRow: {
    position: 'absolute',
    top: '32%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  glassCircle: {
    width: 22,
    height: 18,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: '#3B2214',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  glassBridge: {
    width: 6,
    height: 2.5,
    backgroundColor: '#3B2214',
  },
  speakingBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: THEME.colors.success,
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

