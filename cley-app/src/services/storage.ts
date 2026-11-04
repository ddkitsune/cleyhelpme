import { Preferences } from '@capacitor/preferences';

/**
 * Servicio de Almacenamiento Persistente Nativo
 * Utiliza Android SharedPreferences (a través de Capacitor Preferences)
 * asegurando que los datos NUNCA se borren al reiniciar la app o apagar el teléfono.
 * Incluye respaldo transparente a localStorage en navegadores web.
 */
export class StorageService {
  static async get<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const { value } = await Preferences.get({ key });
      if (value !== null && value !== undefined) {
        return JSON.parse(value) as T;
      }
    } catch {}

    // Fallback a localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = localStorage.getItem(key);
        if (item) {
          return JSON.parse(item) as T;
        }
      }
    } catch {}

    return defaultValue;
  }

  static async set<T>(key: string, value: T): Promise<void> {
    const serialized = JSON.stringify(value);

    // 1. Guardar en SharedPreferences nativo de Android
    try {
      await Preferences.set({ key, value: serialized });
    } catch {}

    // 2. Guardar en localStorage como espejo
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, serialized);
      }
    } catch {}
  }

  static async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch {}
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch {}
  }
}

