import * as Speech from 'expo-speech';

/**
 * Servicio de Síntesis de Voz optimizado para adultos mayores:
 * - Velocidad reducida (0.85x) para facilitar la comprensión auditiva
 * - Tono amigable y claro en español
 */
export class SpeechService {
  private static isSpeaking = false;

  static async speak(text: string, onDone?: () => void) {
    try {
      // Detener cualquier reproducción previa
      await Speech.stop();

      // Limpiar texto de caracteres que suenan mal al ser leídos
      const cleanText = text
        .replace(/[*#_~`]/g, '')
        .replace(/\b(https?:\/\/\S+)/gi, '')
        .trim();

      this.isSpeaking = true;

      Speech.speak(cleanText, {
        language: 'es-ES', // o es-MX / es-US según disponibilidad del sistema
        pitch: 1.0,
        rate: 0.85, // 85% de velocidad para máxima inteligibilidad en seniors
        onDone: () => {
          this.isSpeaking = false;
          if (onDone) onDone();
        },
        onError: () => {
          this.isSpeaking = false;
        }
      });
    } catch (e) {
      console.warn("Error en síntesis de voz:", e);
      this.isSpeaking = false;
    }
  }

  static async stop() {
    try {
      await Speech.stop();
      this.isSpeaking = false;
    } catch (e) {
      console.warn("Error al detener voz:", e);
    }
  }

  static isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }
}

