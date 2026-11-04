import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { THEME } from '../constants/theme';
import { AccessibleButton } from '../components/AccessibleButton';
import { ApiService, MedicationItem } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { SpeechService } from '../services/speech';
import { HapticService } from '../services/haptics';

export default function MedicationsScreen() {
  const [meds, setMeds] = useState<MedicationItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaHora, setNuevaHora] = useState('');
  const [nuevaInstruccion, setNuevaInstruccion] = useState('');

  useEffect(() => {
    loadMeds();
  }, []);

  const loadMeds = async () => {
    const list = await ApiService.getMedications();
    setMeds(list);
  };

  const handleAdd = async () => {
    if (!nuevoNombre.trim() || !nuevaHora.trim()) {
      Alert.alert("Campos requeridos", "Por favor indica el nombre de la pastilla y la hora.");
      return;
    }
    await ApiService.addMedication({
      medicamento: nuevoNombre.trim(),
      hora: nuevaHora.trim(),
      instruccion: nuevaInstruccion.trim() || "Tomar con abundante agua",
    });
    setNuevoNombre('');
    setNuevaHora('');
    setNuevaInstruccion('');
    setShowAddForm(false);
    loadMeds();
  };

  const handleListenMed = (item: MedicationItem) => {
    HapticService.light();
    SpeechService.speak(
      `Es hora de tu medicamento: ${item.medicamento}. Hora programada: ${item.hora}. Instrucción: ${item.instruccion || "Tomar con agua."}`
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>💊 Mis Pastillas del Día</Text>
      <Text style={styles.subtitle}>Toca el altavoz para escuchar las instrucciones de cada medicina:</Text>

      {meds.map((item) => (
        <View key={item.id} style={styles.medCard}>
          <View style={styles.timeBadge}>
            <Ionicons name="time" size={24} color={THEME.colors.primary} />
            <Text style={styles.timeText}>{item.hora}</Text>
          </View>
          <Text style={styles.medName}>{item.medicamento}</Text>
          {item.instruccion ? (
            <Text style={styles.medInstruction}>{item.instruccion}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.listenRow}
            onPress={() => handleListenMed(item)}
            accessibilityRole="button"
          >
            <Ionicons name="volume-high" size={24} color={THEME.colors.primary} />
            <Text style={styles.listenText}>Escuchar recordatorio</Text>
          </TouchableOpacity>
        </View>
      ))}

      {showAddForm ? (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Agregar Nueva Medicina</Text>
          
          <Text style={styles.label}>Nombre del medicamento:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Omeprazol"
            placeholderTextColor={THEME.colors.textMuted}
            value={nuevoNombre}
            onChangeText={setNuevoNombre}
          />

          <Text style={styles.label}>Hora (ej: 09:00 AM):</Text>
          <TextInput
            style={styles.input}
            placeholder="09:00 AM"
            placeholderTextColor={THEME.colors.textMuted}
            value={nuevaHora}
            onChangeText={setNuevaHora}
          />

          <Text style={styles.label}>Instrucción (opcional):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Con el desayuno"
            placeholderTextColor={THEME.colors.textMuted}
            value={nuevaInstruccion}
            onChangeText={setNuevaInstruccion}
          />

          <AccessibleButton
            title="Guardar Medicamento"
            variant="success"
            onPress={handleAdd}
          />

          <AccessibleButton
            title="Cancelar"
            variant="outline"
            onPress={() => setShowAddForm(false)}
          />
        </View>
      ) : (
        <AccessibleButton
          title="➕  Agregar otro medicamento"
          variant="primary"
          onPress={() => setShowAddForm(true)}
          style={styles.addBtn}
        />
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
  title: {
    fontSize: THEME.typography.h1,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: THEME.typography.body,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
    marginTop: 4,
  },
  medCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 20,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    elevation: 2,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  timeText: {
    marginLeft: 6,
    fontSize: THEME.typography.h3,
    fontWeight: '800',
    color: THEME.colors.primaryDark,
  },
  medName: {
    fontSize: THEME.typography.h2,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginVertical: 4,
  },
  medInstruction: {
    fontSize: THEME.typography.body,
    color: THEME.colors.textSecondary,
    marginBottom: 10,
  },
  listenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  listenText: {
    marginLeft: 8,
    fontSize: THEME.typography.label,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  addBtn: {
    marginVertical: THEME.spacing.md,
  },
  formCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 20,
    padding: THEME.spacing.md,
    borderWidth: 2,
    borderColor: THEME.colors.primary,
    marginVertical: THEME.spacing.md,
  },
  formTitle: {
    fontSize: THEME.typography.h2,
    fontWeight: '800',
    color: THEME.colors.primaryDark,
    marginBottom: 12,
  },
  label: {
    fontSize: THEME.typography.label,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: THEME.colors.background,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: THEME.typography.body,
    marginBottom: 8,
  },
});

