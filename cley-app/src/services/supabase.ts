import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StorageService } from './storage';

const SUPABASE_URL_KEY = 'cley_supabase_url';
const SUPABASE_KEY_KEY = 'cley_supabase_key';

export class SupabaseService {
  private static client: SupabaseClient | null = null;

  static async initClient(): Promise<SupabaseClient | null> {
    if (this.client) return this.client;

    const url = await StorageService.get<string>(SUPABASE_URL_KEY, '');
    const key = await StorageService.get<string>(SUPABASE_KEY_KEY, '');

    if (url && key) {
      try {
        this.client = createClient(url, key);
        return this.client;
      } catch (e) {
        console.warn('[Supabase Init Error]:', e);
      }
    }
    return null;
  }

  static async setCredentials(url: string, key: string): Promise<boolean> {
    const cleanUrl = url.trim();
    const cleanKey = key.trim();

    if (!cleanUrl || !cleanKey) {
      this.client = null;
      await StorageService.remove(SUPABASE_URL_KEY);
      await StorageService.remove(SUPABASE_KEY_KEY);
      return false;
    }

    try {
      const client = createClient(cleanUrl, cleanKey);
      this.client = client;
      await StorageService.set(SUPABASE_URL_KEY, cleanUrl);
      await StorageService.set(SUPABASE_KEY_KEY, cleanKey);
      return true;
    } catch {
      return false;
    }
  }

  static async isConfigured(): Promise<boolean> {
    const url = await StorageService.get<string>(SUPABASE_URL_KEY, '');
    const key = await StorageService.get<string>(SUPABASE_KEY_KEY, '');
    return Boolean(url && key);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async syncProfile(profile: any): Promise<boolean> {
    const client = await this.initClient();
    if (!client) return false;

    try {
      const { error } = await client.from('usuarios').upsert({
        nombre: profile.nombre,
        edad: profile.edad,
        dificultad_tecnologica: profile.dificultad_tecnologica,
        actualizado_en: new Date().toISOString(),
      }, { onConflict: 'nombre' });
      return !error;
    } catch {
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async syncMedication(med: any): Promise<boolean> {
    const client = await this.initClient();
    if (!client) return false;

    try {
      const { error } = await client.from('pastillas').insert({
        usuario: med.usuario,
        medicamento: med.medicamento,
        hora: med.hora,
        instruccion: med.instruccion || '',
        creado_en: new Date().toISOString(),
      });
      return !error;
    } catch {
      return false;
    }
  }
}

