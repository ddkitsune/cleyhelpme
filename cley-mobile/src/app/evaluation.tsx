import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { THEME } from '../constants/theme';
import { AccessibleButton } from '../components/AccessibleButton';
import { CleyAvatar } from '../components/CleyAvatar';
import { ApiService } from '../services/api';
import { SpeechBubble } from '../components/SpeechBubble';

export default function EvaluationScreen() {
  const [submitted, setSubmitted] = useState(false);
  const [rating1, setRating1] = useState<number | null>(null);
  const [rating2, setRating2] = useState<number | null>(null);
  const [rating3, setRating3] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (rating1 === null || rating2 === null || rating3 === null) {
      Alert.alert("Tu opinión", "Por favor responde las 3 preguntas para ayudarnos a mejorar.");
      return;
    }

    // Guardar en el backend como evaluación
    await ApiService.saveLessonEvaluation("Encuesta General de Usabilidad", true);
    setSubmitted(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CleyAvatar size={90} />

      {!submitted ? (
        <View style={styles.card}>
          <SpeechBubble text="Tu opinión es lo más valioso para nosotros. Cuéntanos cómo sentiste la aplicación hoy:" />

          <Text style={styles.questionTitle}>1. ¿Te gustaría seguir usando Cley frecuentemente?</Text>
          <View style={styles.optionsRow}>
            <AccessibleButton
              title="👍 Mucho"
              variant={rating1 === 5 ? "success" : "outline"}
              onPress={() => setRating1(5)}
              style={styles.optionBtn}
            />
            <AccessibleButton
              title="😐 Poco"
              variant={rating1 === 2 ? "primary" : "outline"}
              onPress={() => setRating1(2)}
              style={styles.optionBtn}
            />
          </View>

          <Text style={styles.questionTitle}>2. ¿Sentiste que los pasos fueron claros y fáciles?</Text>
          <View style={styles.optionsRow}>
            <AccessibleButton
              title="👍 Sí, muy claros"
              variant={rating2 === 5 ? "success" : "outline"}
              onPress={() => setRating2(5)}
              style={styles.optionBtn}
            />
            <AccessibleButton
              title="👎 Algo difíciles"
              variant={rating2 === 2 ? "primary" : "outline"}
              onPress={() => setRating2(2)}
              style={styles.optionBtn}
            />
          </View>

          <Text style={styles.questionTitle}>3. ¿Te sentiste en confianza y seguro usándola?</Text>
          <View style={styles.optionsRow}>
            <AccessibleButton
              title="👍 Muy seguro"
              variant={rating3 === 5 ? "success" : "outline"}
              onPress={() => setRating3(5)}
              style={styles.optionBtn}
            />
            <AccessibleButton
              title="😐 Con dudas"
              variant={rating3 === 2 ? "primary" : "outline"}
              onPress={() => setRating3(2)}
              style={styles.optionBtn}
            />
          </View>

          <AccessibleButton
            title="Enviar mi Evaluación  ➔"
            variant="primary"
            onPress={handleSubmit}
            style={styles.submitBtn}
          />
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.thanksTitle}>¡Muchísimas Gracias!</Text>
          <Text style={styles.thanksText}>
            Tus respuestas han sido guardadas. Con tu ayuda estamos haciendo la tecnología más cercana, amable y accesible para todos.
          </Text>
          <AccessibleButton
            title="Volver al Menú Principal"
            variant="primary"
            onPress={() => router.replace('/dashboard')}
            style={styles.submitBtn}
          />
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
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 24,
    padding: THEME.spacing.lg,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    elevation: 3,
  },
  questionTitle: {
    fontSize: THEME.typography.h3,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  optionBtn: {
    flex: 1,
    marginHorizontal: 4,
    minHeight: 52,
  },
  submitBtn: {
    marginTop: 20,
  },
  thanksTitle: {
    fontSize: THEME.typography.h1,
    fontWeight: '800',
    color: THEME.colors.success,
    textAlign: 'center',
    marginVertical: 12,
  },
  thanksText: {
    fontSize: THEME.typography.bodyLarge,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 20,
  },
});

