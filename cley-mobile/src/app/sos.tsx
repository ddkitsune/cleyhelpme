import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking, TextInput } from 'react-native';
import { THEME } from '../constants/theme';
import { AccessibleButton } from '../components/AccessibleButton';
import { ApiService, EmergencyContact } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { HapticService } from '../services/haptics';

export default function SOSScreen() {
  const [contact, setContact] = useState<EmergencyContact | null>(null);
  const [editing, setEditing] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [parentesco, setParentesco] = useState('');

  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    const c = await ApiService.getEmergencyContact();
    setContact(c);
    setNombre(c.nombre_contacto);
    setTelefono(c.telefono);
    setParentesco(c.parentesco);
  };

  const handleCallSOS = () => {
    if (!contact) return;
    HapticService.emergency();

    const cleanPhone = contact.telefono.replace(/\s+/g, '');
    const url = `tel:${cleanPhone}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Llamada", `Por favor llama al: ${contact.telefono}`);
        }
      })
      .catch(() => {
        Alert.alert("Llamada", `Por favor llama al: ${contact.telefono}`);
      });
  };

  const handleSaveContact = async () => {
    if (!nombre.trim() || !telefono.trim()) {
      Alert.alert("Datos requeridos", "Por favor ingresa el nombre y teléfono del familiar de contacto.");
      return;
    }
    await ApiService.saveEmergencyContact({
      nombre_contacto: nombre.trim(),
      telefono: telefono.trim(),
      parentesco: parentesco.trim() || "Familiar",
    });
    setEditing(false);
    loadContact();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.alertBanner}>
        <Ionicons name="warning" size={36} color={THEME.colors.danger} />
        <Text style={styles.alertTitle}>Botón de Ayuda Inmediata</Text>
        <Text style={styles.alertSubtitle}>
          Al presionar el botón rojo llamarás de inmediato a tu familiar de confianza:
        </Text>
      </View>

      {contact && (
        <View style={styles.contactCard}>
          <Text style={styles.contactKinship}>{contact.parentesco}</Text>
          <Text style={styles.contactName}>{contact.nombre_contacto}</Text>
          <Text style={styles.contactPhone}>{contact.telefono}</Text>
        </View>
      )}

      <AccessibleButton
        title="🚨  LLAMAR AHORA A MI FAMILIAR"
        variant="danger"
        onPress={handleCallSOS}
        style={styles.sosButton}
        textStyle={styles.sosButtonText}
      />

      {editing ? (
        <View style={styles.editCard}>
          <Text style={styles.editTitle}>Editar Contacto de Emergencia</Text>
          
          <Text style={styles.label}>Nombre:</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej: Hija María"
          />

          <Text style={styles.label}>Teléfono:</Text>
          <TextInput
            style={styles.input}
            value={telefono}
            onChangeText={setTelefono}
            placeholder="Ej: +58 414 123 4567"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Parentesco:</Text>
          <TextInput
            style={styles.input}
            value={parentesco}
            onChangeText={setParentesco}
            placeholder="Ej: Hija mayor"
          />

          <AccessibleButton
            title="Guardar Contacto"
            variant="success"
            onPress={handleSaveContact}
          />
          <AccessibleButton
            title="Cancelar"
            variant="outline"
            onPress={() => setEditing(false)}
          />
        </View>
      ) : (
        <AccessibleButton
          title="⚙️  Cambiar número de contacto"
          variant="outline"
          onPress={() => setEditing(true)}
          style={{ marginTop: 16 }}
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
  alertBanner: {
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  alertTitle: {
    fontSize: THEME.typography.h1,
    fontWeight: '800',
    color: THEME.colors.danger,
    marginTop: 6,
  },
  alertSubtitle: {
    fontSize: THEME.typography.body,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 24,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: THEME.spacing.lg,
    borderWidth: 2,
    borderColor: THEME.colors.dangerLight,
    alignItems: 'center',
    marginVertical: THEME.spacing.md,
  },
  contactKinship: {
    fontSize: THEME.typography.label,
    fontWeight: '700',
    color: THEME.colors.primary,
    textTransform: 'uppercase',
  },
  contactName: {
    fontSize: THEME.typography.h2,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginVertical: 4,
  },
  contactPhone: {
    fontSize: THEME.typography.h3,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  sosButton: {
    minHeight: 80,
    borderRadius: 24,
    marginVertical: THEME.spacing.md,
  },
  sosButtonText: {
    fontSize: THEME.typography.h2,
    fontWeight: '900',
  },
  editCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 20,
    padding: THEME.spacing.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    marginTop: THEME.spacing.md,
  },
  editTitle: {
    fontSize: THEME.typography.h2,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 8,
  },
  label: {
    fontSize: THEME.typography.label,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 6,
  },
  input: {
    backgroundColor: THEME.colors.background,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: THEME.typography.body,
    marginTop: 4,
  },
});

