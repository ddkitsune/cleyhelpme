import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';
import { CleyAvatar } from '../components/CleyAvatar';
import { AccessibleButton } from '../components/AccessibleButton';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const handleStart = () => {
    router.push('/onboarding');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <CleyAvatar size={140} />
          <Text style={styles.title}>¡Bienvenido a{"\n"}Cley's HelpMe!</Text>
          <Text style={styles.subtitle}>
            Tu asistente personal y cariñoso para aprender a usar tu teléfono inteligente sin enredos.
          </Text>
        </View>

        <View style={styles.cardFeatures}>
          <View style={styles.featureRow}>
            <Ionicons name="chatbubbles" size={28} color={THEME.colors.primary} />
            <Text style={styles.featureText}>Aprende a tu propio ritmo</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="mic" size={28} color={THEME.colors.primary} />
            <Text style={styles.featureText}>Háblale o escúchalo en voz alta</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="medkit" size={28} color={THEME.colors.primary} />
            <Text style={styles.featureText}>Recordatorios de tus medicamentos</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <AccessibleButton
            title="Empezar  ➔"
            onPress={handleStart}
            variant="primary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: THEME.spacing.md,
  },
  title: {
    fontSize: THEME.typography.hero,
    fontWeight: '800',
    color: THEME.colors.primary,
    textAlign: 'center',
    marginVertical: THEME.spacing.md,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: THEME.typography.bodyLarge,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
  },
  cardFeatures: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 20,
    padding: THEME.spacing.lg,
    marginVertical: THEME.spacing.lg,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  featureText: {
    marginLeft: 14,
    fontSize: THEME.typography.body,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  footer: {
    marginBottom: THEME.spacing.md,
  },
});

