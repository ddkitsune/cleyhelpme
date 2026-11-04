import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { THEME } from '../constants/theme';
import { CleyAvatar } from '../components/CleyAvatar';
import { AccessibleButton } from '../components/AccessibleButton';
import { ApiService, UserProfile } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const [user, setUser] = useState<UserProfile>(ApiService.getStoredProfile());

  useEffect(() => {
    setUser(ApiService.getStoredProfile());
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBanner}>
        <CleyAvatar size={100} />
        <Text style={styles.greetingTitle}>¡Hola, {user.nombre}!</Text>
        <Text style={styles.greetingSubtitle}>¿Qué te gustaría hacer hoy?</Text>
      </View>

      <View style={styles.menuSection}>
        <AccessibleButton
          title="🎙️  Hablar con Cley"
          onPress={() => router.push('/assistant')}
          variant="primary"
          style={styles.mainActionBtn}
          textStyle={styles.mainActionText}
        />

        <AccessibleButton
          title="📱  Aprender a usar mis Apps"
          onPress={() => router.push('/lessons')}
          variant="primary"
          style={styles.mainActionBtn}
          textStyle={styles.mainActionText}
        />

        <View style={styles.quickCareGrid}>
          <AccessibleButton
            title="💊  Mis Pastillas"
            onPress={() => router.push('/medications')}
            variant="secondary"
            style={styles.careBtn}
          />

          <AccessibleButton
            title="🚨  Ayuda SOS"
            onPress={() => router.push('/sos')}
            variant="danger"
            style={styles.careBtn}
          />
        </View>

        <View style={styles.evalSection}>
          <AccessibleButton
            title="⭐  ¿Cómo te ha parecido la App? (Evaluar)"
            onPress={() => router.push('/evaluation')}
            variant="outline"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: THEME.spacing.lg,
    backgroundColor: THEME.colors.background,
  },
  topBanner: {
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  greetingTitle: {
    fontSize: THEME.typography.h1,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginTop: 8,
  },
  greetingSubtitle: {
    fontSize: THEME.typography.body,
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  menuSection: {
    marginTop: THEME.spacing.sm,
  },
  mainActionBtn: {
    minHeight: 72,
    marginVertical: 10,
    borderRadius: 20,
  },
  mainActionText: {
    fontSize: THEME.typography.h2,
  },
  quickCareGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  careBtn: {
    flex: 1,
    marginHorizontal: 4,
    minHeight: 64,
  },
  evalSection: {
    marginTop: THEME.spacing.lg,
  },
});

