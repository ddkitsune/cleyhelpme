import * as Haptics from 'expo-haptics';

/**
 * Servicio de Retroalimentación Háptica.
 * Proporciona confirmación física al pulsar botones, vital para personas con
 * pérdida de sensibilidad táctil o temblores en las manos.
 */
export class HapticService {
  static async light() {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignorar en plataformas sin soporte
    }
  }

  static async medium() {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
  }

  static async success() {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  }

  static async warning() {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {}
  }

  static async emergency() {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {}
  }
}

