import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { THEME } from '../constants/theme';
import { HapticService } from '../services/haptics';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const AccessibleButton: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
  textStyle,
  disabled = false,
}) => {
  const handlePress = () => {
    if (disabled) return;
    if (variant === 'danger') {
      HapticService.emergency();
    } else {
      HapticService.light();
    }
    onPress();
  };

  const getBackgroundColor = () => {
    if (disabled) return '#CBD5E1';
    switch (variant) {
      case 'primary': return THEME.colors.primary;
      case 'secondary': return THEME.colors.textSecondary;
      case 'success': return THEME.colors.success;
      case 'danger': return THEME.colors.danger;
      case 'outline': return 'transparent';
      default: return THEME.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return '#64748B';
    if (variant === 'outline') return THEME.colors.primary;
    return THEME.colors.textInverse;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && styles.outlineBorder,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.contentRow}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: THEME.touchTarget.minHeight,
    minWidth: THEME.touchTarget.minWidth,
    borderRadius: THEME.touchTarget.borderRadius,
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: THEME.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    marginVertical: 8,
  },
  outlineBorder: {
    borderWidth: 2.5,
    borderColor: THEME.colors.primary,
    elevation: 0,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  text: {
    fontSize: THEME.typography.bodyLarge,
    fontWeight: '700',
    textAlign: 'center',
  },
});

