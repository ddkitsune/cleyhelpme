import { Capacitor } from '@capacitor/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

/**
 * Servicio de Reconocimiento de Voz (Speech-to-Text)
 * Permite al adulto mayor hablarle directamente a Cley presionando el micrófono.
 * - En Android: Utiliza el reconocedor de voz nativo de Google / Android.
 * - En Web: Utiliza webkitSpeechRecognition / SpeechRecognition estándar.
 */
export class VoiceInputService {
  private static isListening = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static webRecognizer: any = null;

  static async isAvailable(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      try {
        const { available } = await SpeechRecognition.available();
        return available;
      } catch {
        return false;
      }
    }

    if (typeof window !== 'undefined') {
      return (
        'webkitSpeechRecognition' in window ||
        'SpeechRecognition' in window
      );
    }

    return false;
  }

  static async requestPermissions(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      try {
        const status = await SpeechRecognition.requestPermissions();
        return status.speechRecognition === 'granted';
      } catch {
        return false;
      }
    }
    return true;
  }

  static async startListening(
    onResult: (transcript: string) => void,
    onError: (errorMessage: string) => void,
    onEnd?: () => void
  ): Promise<void> {
    if (this.isListening) {
      await this.stopListening();
    }

    this.isListening = true;

    // 1. MODO NATIVO ANDROID
    if (Capacitor.isNativePlatform()) {
      try {
        const hasPerms = await this.requestPermissions();
        if (!hasPerms) {
          this.isListening = false;
          onError('Por favor concede permiso de micrófono a la aplicación.');
          return;
        }

        const result = await SpeechRecognition.start({
          language: 'es-ES',
          maxResults: 1,
          prompt: 'Dime, ¿en qué te puedo ayudar?',
          popup: true,
          partialResults: false,
        });

        this.isListening = false;
        if (onEnd) onEnd();

        if (result && result.matches && result.matches.length > 0) {
          const spokenText = result.matches[0].trim();
          if (spokenText) {
            onResult(spokenText);
          }
        }
        return;
      } catch (err: unknown) {
        this.isListening = false;
        if (onEnd) onEnd();
        const msg = err instanceof Error ? err.message : String(err);
        if (!msg.toLowerCase().includes('cancel')) {
          onError('No logré escucharte con claridad. Intenta de nuevo.');
        }
        return;
      }
    }

    // 2. MODO NAVEGADOR WEB (webkitSpeechRecognition)
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognitionClass) {
        this.isListening = false;
        onError('Tu navegador no soporta entrada de voz.');
        return;
      }

      try {
        const recognition = new SpeechRecognitionClass();
        recognition.lang = 'es-ES';
        recognition.continuous = false;
        recognition.interimResults = false;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          this.isListening = false;
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            onResult(transcript);
          }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (event: any) => {
          this.isListening = false;
          onError(`Error al escuchar: ${event.error || 'intenta de nuevo'}`);
        };

        recognition.onend = () => {
          this.isListening = false;
          if (onEnd) onEnd();
        };

        this.webRecognizer = recognition;
        recognition.start();
      } catch (e) {
        this.isListening = false;
        onError('No se pudo iniciar el micrófono en el navegador.');
      }
    }
  }

  static async stopListening(): Promise<void> {
    this.isListening = false;

    if (Capacitor.isNativePlatform()) {
      try {
        await SpeechRecognition.stop();
      } catch {}
    }

    if (this.webRecognizer) {
      try {
        this.webRecognizer.stop();
      } catch {}
      this.webRecognizer = null;
    }
  }

  static getIsListening(): boolean {
    return this.isListening;
  }
}

