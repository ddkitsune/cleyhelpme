import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { THEME } from '../constants/theme';
import { CleyAvatar } from '../components/CleyAvatar';
import { AccessibleButton } from '../components/AccessibleButton';
import { ApiService } from '../services/api';
import { SpeechBubble } from '../components/SpeechBubble';

export default function OnboardingScreen() {
  const [step, setStep] = useState<'nombre' | 'edad' | 'dificultad'>('nombre');
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNextNombre = () => {
    if (!nombre.trim()) {
      Alert.alert("Por favor", "Dime tu nombre para saber cómo llamarte con cariño.");
      return;
    }
    setStep('edad');
  };

  const handleNextEdad = () => {
    const edadNum = parseInt(edad);
    if (!edad || isNaN(edadNum) || edadNum < 1 || edadNum > 120) {
      Alert.alert("Edad", "Por favor ingresa tu edad en números (por ejemplo: 72).");
      return;
    }
    setStep('dificultad');
  };

  const handleFinish = async (tieneDificultad: boolean) => {
    setLoading(true);
    await ApiService.saveProfile({
      nombre: nombre.trim(),
      edad: parseInt(edad) || 70,
      dificultad_tecnologica: tieneDificultad,
    });
    setLoading(false);
    router.replace('/dashboard');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CleyAvatar size={100} />

      {step === 'nombre' && (
        <View style={styles.card}>
          <SpeechBubble text="¡Hola! Soy Cley y estoy aquí para facilitarte el uso de tu teléfono. Primero dime, ¿cómo te llamas?" />
          <Text style={styles.questionLabel}>1. Escribe tu nombre:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ejemplo: Carmen"
            placeholderTextColor={THEME.colors.textMuted}
            value={nombre}
            onChangeText={setNombre}
            autoFocus
          />
          <View style={styles.navRow}>
            <AccessibleButton
              title="Siguiente  ➔"
              onPress={handleNextNombre}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      )}

      {step === 'edad' && (
        <View style={styles.card}>
          <SpeechBubble text={`¡Mucho gusto, ${nombre}! Ahora cuéntame, ¿cuántos años tienes?`} />
          <Text style={styles.questionLabel}>2. Tu edad:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ejemplo: 72"
            placeholderTextColor={THEME.colors.textMuted}
            value={edad}
            onChangeText={setEdad}
            keyboardType="number-pad"
            autoFocus
          />
          <View style={styles.buttonRow}>
            <AccessibleButton
              title="⬅ Retroceder"
              variant="outline"
              onPress={() => setStep('nombre')}
              style={{ flex: 1, marginRight: 8 }}
            />
            <AccessibleButton
              title="Siguiente ➔"
              onPress={handleNextEdad}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
        </View>
      )}

      {step === 'dificultad' && (
        <View style={styles.card}>
          <SpeechBubble text="Una última pregunta para ayudarte mejor: ¿Sientes que se te hace difícil o complicado usar este teléfono?" />
          <Text style={styles.questionLabel}>3. ¿Se te dificulta usar tu teléfono?</Text>
          
          <View style={styles.evalContainer}>
            <AccessibleButton
              title="SÍ, se me dificulta"
              variant="primary"
              onPress={() => handleFinish(true)}
              style={styles.choiceBtn}
            />
            <AccessibleButton
              title="NO, me defiendo bien"
              variant="success"
              onPress={() => handleFinish(false)}
              style={styles.choiceBtn}
            />
          </View>

          <AccessibleButton
            title="⬅ Retroceder"
            variant="outline"
            onPress={() => setStep('edad')}
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
  questionLabel: {
    fontSize: THEME.typography.h2,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginVertical: THEME.spacing.md,
  },
  input: {
    backgroundColor: THEME.colors.background,
    borderWidth: 2,
    borderColor: THEME.colors.border,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: THEME.typography.h3,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.lg,
  },
  navRow: {
    marginTop: THEME.spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  evalContainer: {
    marginVertical: THEME.spacing.md,
  },
  choiceBtn: {
    marginVertical: 10,
  },
});

