import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Detecta automáticamente la IP de la máquina de desarrollo (tanto para teléfono físico como emulador)
const hostIp = Constants.expoConfig?.hostUri?.split(':')[0] || '192.168.31.199';
const BASE_URL = `http://${hostIp}:8000/api/v1`;

export interface UserProfile {
  nombre: string;
  edad: number;
  dificultad_tecnologica: boolean;
}

export interface MedicationItem {
  id: number;
  medicamento: string;
  hora: string;
  instruccion: string;
  activo: boolean;
}

export interface EmergencyContact {
  id: number;
  nombre_contacto: string;
  telefono: string;
  parentesco: string;
}

export class ApiService {
  // Caché en memoria para funcionamiento 100% offline
  private static localUser: UserProfile = {
    nombre: "Amigo",
    edad: 70,
    dificultad_tecnologica: true,
  };

  private static localMedications: MedicationItem[] = [
    { id: 1, medicamento: "Pastilla de la Tensión (Losartán)", hora: "08:00 AM", instruccion: "Tomar con un vaso de agua después del desayuno", activo: true },
    { id: 2, medicamento: "Complejo Vitamínico B", hora: "01:00 PM", instruccion: "Tomar junto con el almuerzo", activo: true },
    { id: 3, medicamento: "Calcio / Vitamina D", hora: "08:00 PM", instruccion: "Tomar antes de dormir", activo: true },
  ];

  private static localEmergency: EmergencyContact = {
    id: 1,
    nombre_contacto: "Hija María (Contacto de Emergencia)",
    telefono: "+58 414 123 4567",
    parentesco: "Hija Mayor",
  };

  static async saveProfile(profile: UserProfile): Promise<boolean> {
    this.localUser = profile;
    try {
      const res = await fetch(`${BASE_URL}/profile/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      return res.ok;
    } catch {
      // Offline fallback
      return true;
    }
  }

  static getStoredProfile(): UserProfile {
    return this.localUser;
  }

  static async askAssistant(pregunta: string): Promise<{ respuesta: string; modo: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`${BASE_URL}/assistant/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: this.localUser.nombre,
          edad: this.localUser.edad,
          dificultad: this.localUser.dificultad_tecnologica,
          pregunta: pregunta,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return { respuesta: data.respuesta, modo: data.modo };
      }
    } catch {
      // Ignorar error y usar fallback offline
    }

    // Fallback inteligente offline
    const q = pregunta.toLowerCase();
    if (q.includes("voz") || q.includes("audio") || q.includes("whatsapp")) {
      return {
        respuesta: `¡Claro que sí, ${this.localUser.nombre}! Para enviar un audio en WhatsApp: Primero, abre la conversación con tu familiar. Segundo, mantén presionado el botón redondo verde con el micrófono abajo a la derecha. Tercero, habla con calma y suelta el botón para enviarlo.`,
        modo: "offline_local"
      };
    } else if (q.includes("foto") || q.includes("cámara")) {
      return {
        respuesta: `¡Con gusto, ${this.localUser.nombre}! Para tomar una foto: Primero, toca el dibujo de la cámara en tu pantalla. Segundo, apunta hacia lo que deseas fotografiar. Tercero, presiona el círculo blanco grande que ves en el centro abajo.`,
        modo: "offline_local"
      };
    } else {
      return {
        respuesta: `¡Hola ${this.localUser.nombre}! Para hacer eso: Primero, busca el icono en tu pantalla principal. Segundo, tócalo suavemente una vez con tu dedo. Tercero, sigue las letras grandes que aparezcan. ¡Lo estás haciendo muy bien!`,
        modo: "offline_local"
      };
    }
  }

  static async getMedications(): Promise<MedicationItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/medications/?usuario=${encodeURIComponent(this.localUser.nombre)}`);
      if (res.ok) {
        const data = await res.json();
        return data.pastillas;
      }
    } catch {}
    return this.localMedications;
  }

  static async addMedication(med: { medicamento: string; hora: string; instruccion: string }): Promise<void> {
    const newItem: MedicationItem = {
      id: Date.now(),
      medicamento: med.medicamento,
      hora: med.hora,
      instruccion: med.instruccion,
      activo: true,
    };
    this.localMedications.push(newItem);

    try {
      await fetch(`${BASE_URL}/medications/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: this.localUser.nombre,
          medicamento: med.medicamento,
          hora: med.hora,
          instruccion: med.instruccion,
        }),
      });
    } catch {}
  }

  static async getEmergencyContact(): Promise<EmergencyContact> {
    try {
      const res = await fetch(`${BASE_URL}/emergency/?usuario=${encodeURIComponent(this.localUser.nombre)}`);
      if (res.ok) {
        const data = await res.json();
        return data.contacto;
      }
    } catch {}
    return this.localEmergency;
  }

  static async saveEmergencyContact(contact: { nombre_contacto: string; telefono: string; parentesco: string }): Promise<void> {
    this.localEmergency = { id: 1, ...contact };
    try {
      await fetch(`${BASE_URL}/emergency/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: this.localUser.nombre,
          ...contact,
        }),
      });
    } catch {}
  }

  static async saveLessonEvaluation(leccion: string, fueDeAyuda: boolean): Promise<void> {
    try {
      await fetch(`${BASE_URL}/evaluations/lesson`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: this.localUser.nombre,
          leccion: leccion,
          fue_de_ayuda: fueDeAyuda,
        }),
      });
    } catch {}
  }
}
