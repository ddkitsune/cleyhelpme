import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { THEME } from '../constants/theme';
import { CleyAvatar } from '../components/CleyAvatar';
import { AccessibleButton } from '../components/AccessibleButton';
import { SpeechBubble } from '../components/SpeechBubble';
import { ApiService } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { HapticService } from '../services/haptics';

const SUGGESTIONS = [
  "¿Cómo envío un audio por WhatsApp?",
  "¿Cómo tomo una buena foto?",
  "¿Cómo hago una llamada telefónica?",
  "¿Cómo pongo música en YouTube?",
];

export default function AssistantScreen() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleAsk = async (textToAsk?: string) => {
    const question = (textToAsk || query).trim();
    if (!question) return;

    HapticService.light();
    setLoading(true);
    setResponse(null);

    const res = await ApiService.askAssistant(question);
    setLoading(false);
    setResponse(res.respuesta);
    setQuery('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarRow}>
        <CleyAvatar size={90} mood={loading ? 'listening' : response ? 'speaking' : 'happy'} />
        <View style={styles.introBubble}>
          <Text style={styles.introText}>
            {response
              ? "Aquí tienes la respuesta paso a paso. Puedes escucharla tocando el botón azul:"
              : "¡Dime! ¿En qué te puedo ayudar hoy con tu teléfono?"}
          </Text>
        </View>
      </View>

      {response && (
        <View style={styles.responseContainer}>
          <SpeechBubble text={response} autoSpeak={true} />
          
          <AccessibleButton
            title="✅  ¡Entendido, muchas gracias!"
            variant="success"
            onPress={() => {
              ApiService.saveLessonEvaluation("Consulta con IA", true);
              router.back();
            }}
            style={styles.understoodBtn}
          />

          <AccessibleButton
            title="🔄  Hacer otra pregunta"
            variant="outline"
            onPress={() => setResponse(null)}
          />
        </View>
      )}

      {!response && (
        <View style={styles.askSection}>
          <Text style={styles.label}>Preguntas sugeridas frecuentes:</Text>
          <View style={styles.chipsContainer}>
            {SUGGESTIONS.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.chip}
                onPress={() => handleAsk(item)}
                accessibilityRole="button"
              >
                <Text style={styles.chipText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>O escribe tu propia duda:</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ej: ¿Cómo mandar una foto?"
              placeholderTextColor={THEME.colors.textMuted}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => handleAsk()}
            />
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={THEME.colors.primary} />
              <Text style={styles.loadingText}>Cley está pensando con mucho cariño...</Text>
            </View>
          ) : (
            <AccessibleButton
              title="Preguntar a Cley  ➔"
              onPress={() => handleAsk()}
              variant="primary"
              disabled={!query.trim()}
            />
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: THEME.spacing.lg,
    backgroundColor: THEME.colors.background,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  introBubble: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: THEME.colors.surface,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  introText: {
    fontSize: THEME.typography.body,
    color: THEME.colors.textPrimary,
    fontWeight: '600',
    lineHeight: 24,
  },
  responseContainer: {
    marginTop: THEME.spacing.sm,
  },
  understoodBtn: {
    marginVertical: 12,
  },
  askSection: {
    marginTop: THEME.spacing.sm,
  },
  label: {
    fontSize: THEME.typography.h3,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginVertical: 10,
  },
  chipsContainer: {
    marginBottom: THEME.spacing.md,
  },
  chip: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 2,
    borderColor: THEME.colors.primaryLight,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginVertical: 6,
  },
  chipText: {
    fontSize: THEME.typography.body,
    fontWeight: '600',
    color: THEME.colors.primaryDark,
  },
  inputRow: {
    marginBottom: THEME.spacing.md,
  },
  input: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 2,
    borderColor: THEME.colors.border,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: THEME.typography.bodyLarge,
    color: THEME.colors.textPrimary,
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: THEME.typography.body,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
});

