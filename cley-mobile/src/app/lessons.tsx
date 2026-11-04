import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { THEME } from '../constants/theme';
import { AccessibleButton } from '../components/AccessibleButton';
import { SpeechBubble } from '../components/SpeechBubble';
import { ApiService } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { HapticService } from '../services/haptics';

interface Lesson {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  steps: { instruction: string; visualTip: string }[];
}

const LESSONS: Lesson[] = [
  {
    id: 'whatsapp',
    title: 'Enviar Audio en WhatsApp',
    icon: 'logo-whatsapp',
    color: '#25D366',
    steps: [
      {
        instruction: 'Abre la conversación con tu hijo o familiar.',
        visualTip: 'Toca sobre el nombre de la persona en la lista verde.'
      },
      {
        instruction: 'Mantén presionado el botón verde redondo con el dibujo de un micrófono.',
        visualTip: 'Está abajo a la derecha de tu pantalla.'
      },
      {
        instruction: 'Habla con calma. Cuando termines de hablar, suelta tu dedo para que el mensaje se envíe.',
        visualTip: '¡Listo! Verás la barrita de audio enviada.'
      }
    ]
  },
  {
    id: 'camera',
    title: 'Tomar una Buena Foto',
    icon: 'camera',
    color: '#3B82F6',
    steps: [
      {
        instruction: 'Busca y toca el icono de la Cámara en tu teléfono.',
        visualTip: 'Tiene el dibujo de una cámara fotográfica.'
      },
      {
        instruction: 'Sostén el teléfono firme con ambas manos y apunta hacia lo que deseas retratar.',
        visualTip: 'Intenta no moverte para que no salga borrosa.'
      },
      {
        instruction: 'Toca suavemente el círculo blanco grande que está abajo en el centro.',
        visualTip: 'Escucharás el sonido del obturador y la foto se guardará.'
      }
    ]
  },
  {
    id: 'call',
    title: 'Hacer una Llamada Telefónica',
    icon: 'call',
    color: '#10B981',
    steps: [
      {
        instruction: 'Toca el icono verde del auricular del teléfono.',
        visualTip: 'Suele estar abajo en la pantalla principal.'
      },
      {
        instruction: 'Toca la pestaña que dice "Contactos" arriba o abajo.',
        visualTip: 'Busca el nombre de la persona en la lista ordenada por orden alfabético.'
      },
      {
        instruction: 'Toca una sola vez sobre el nombre y luego presiona el botón verde de llamar.',
        visualTip: 'Lleva el teléfono a tu oreja para escuchar el timbre.'
      }
    ]
  },
  {
    id: 'youtube',
    title: 'Escuchar Música en YouTube',
    icon: 'logo-youtube',
    color: '#EF4444',
    steps: [
      {
        instruction: 'Abre la aplicación roja de YouTube.',
        visualTip: 'Tiene un triángulo blanco adentro de un rectángulo rojo.'
      },
      {
        instruction: 'Toca el dibujo de la lupa arriba a la derecha.',
        visualTip: 'Escribe el nombre de tu cantante o canción favorita.'
      },
      {
        instruction: 'Toca el primer video que aparezca para que empiece a sonar la música.',
        visualTip: 'Puedes subir el volumen con los botones en el costado de tu teléfono.'
      }
    ]
  }
];

export default function LessonsScreen() {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const startLesson = (lesson: Lesson) => {
    HapticService.light();
    setActiveLesson(lesson);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (!activeLesson) return;
    HapticService.light();
    if (currentStep < activeLesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Lección completada
      ApiService.saveLessonEvaluation(activeLesson.title, true);
      setActiveLesson(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!activeLesson ? (
        <View>
          <Text style={styles.headerTitle}>¿Qué deseas aprender hoy?</Text>
          <Text style={styles.headerSubtitle}>Toca una lección para practicar paso a paso:</Text>

          <View style={styles.grid}>
            {LESSONS.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                style={styles.card}
                onPress={() => startLesson(lesson)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconCircle, { backgroundColor: lesson.color }]}>
                  <Ionicons name={lesson.icon} size={36} color="#FFFFFF" />
                </View>
                <Text style={styles.cardTitle}>{lesson.title}</Text>
                <Text style={styles.cardStepCount}>{lesson.steps.length} pasos sencillos</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.activeLessonContainer}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepIndicator}>
              Paso {currentStep + 1} de {activeLesson.steps.length}
            </Text>
            <Text style={styles.activeTitle}>{activeLesson.title}</Text>
          </View>

          <SpeechBubble
            text={activeLesson.steps[currentStep].instruction}
            autoSpeak={true}
          />

          <View style={styles.tipBox}>
            <Ionicons name="bulb" size={28} color={THEME.colors.warning} />
            <Text style={styles.tipText}>
              {activeLesson.steps[currentStep].visualTip}
            </Text>
          </View>

          <AccessibleButton
            title={
              currentStep < activeLesson.steps.length - 1
                ? "Siguiente Paso  ➔"
                : "✅  ¡He completado la lección!"
            }
            onPress={handleNextStep}
            variant="success"
            style={styles.nextBtn}
          />

          <AccessibleButton
            title="⬅ Salir de la lección"
            onPress={() => setActiveLesson(null)}
            variant="outline"
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
  headerTitle: {
    fontSize: THEME.typography.h1,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: THEME.typography.body,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
    marginTop: 4,
  },
  grid: {
    marginTop: THEME.spacing.sm,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 20,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTitle: {
    flex: 1,
    fontSize: THEME.typography.h3,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  cardStepCount: {
    fontSize: THEME.typography.label,
    color: THEME.colors.textMuted,
  },
  activeLessonContainer: {
    paddingVertical: THEME.spacing.sm,
  },
  stepHeader: {
    marginBottom: THEME.spacing.md,
  },
  stepIndicator: {
    fontSize: THEME.typography.h3,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  activeTitle: {
    fontSize: THEME.typography.h2,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginTop: 4,
  },
  tipBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tipText: {
    marginLeft: 12,
    fontSize: THEME.typography.body,
    color: '#92400E',
    fontWeight: '600',
    flex: 1,
  },
  nextBtn: {
    marginVertical: 10,
  },
});

