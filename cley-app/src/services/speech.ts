import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

/**
 * Servicio de Síntesis de Voz (Text-to-Speech)
 * - En Android nativo: Usa el motor nativo de Android (android.speech.tts.TextToSpeech)
 * - En navegador: Usa Web Speech API (window.speechSynthesis) con soporte de reanudación
 * - Configurado para velocidad pausada (0.85x) apta para adultos mayores
 */
export class SpeechService {
  private static isSpeaking = false;

  private static clean(text: string): string {
    return text
      .replace(/[*#_~`]/g, '')
      .replace(/\b(https?:\/\/\S+)/gi, '')
      .trim();
  }

  static async speak(text: string, onDone?: () => void): Promise<void> {
    const cleanText = this.clean(text);
    if (!cleanText) return;

    await this.stop();

    this.isSpeaking = true;

    // Modo 1: Android Nativo (Capacitor)
    if (Capacitor.isNativePlatform()) {
      try {
        await TextToSpeech.speak({
          text: cleanText,
          lang: 'es-ES',
          rate: 0.85,
          pitch: 1.0,
          volume: 1.0,
          category: 'ambient',
        });
        this.isSpeaking = false;
        if (onDone) onDone();
        return;
      } catch (err) {
        console.warn('[TTS Native Error, fallback to WebSpeech]:', err);
      }
    }

    // Modo 2: Navegador Web (Fallback Web Speech API)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'es-ES';
        utterance.rate = 0.85;
        utterance.pitch = 1.0;

        utterance.onend = () => {
          this.isSpeaking = false;
          if (onDone) onDone();
        };

        utterance.onerror = () => {
          this.isSpeaking = false;
        };

        // Forzar reanudación por bug conocido de Chrome/Android
        window.speechSynthesis.resume();
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error('[WebSpeech Error]:', e);
        this.isSpeaking = false;
      }
    } else {
      this.isSpeaking = false;
    }
  }

  static async stop(): Promise<void> {
    this.isSpeaking = false;

    if (Capacitor.isNativePlatform()) {
      try {
        await TextToSpeech.stop();
      } catch {}
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }

  static isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }
}
